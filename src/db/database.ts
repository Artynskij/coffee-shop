import SQLite from 'react-native-sqlite-storage';
import {IDatabaseData} from '../types/dataType';

class Database {
  private db: SQLite.SQLiteDatabase;

  constructor() {
    this.db = SQLite.openDatabase(
      {
        name: 'app.db', // Название файла базы данных
        location: 'default', // Стандартное расположение
      },
      () => {
        console.log('Database opened successfully');
      },
      error => {
        console.log('Error opening database: ', error);
      },
    );
    this.createTable(); // Создание таблицы при инициализации
  }

  // Функция для создания таблицы
  private createTable() {
    this.db.transaction((tx: SQLite.Transaction) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, value TEXT);',
        [],
        () => {
          console.log('Table created successfully');
        },
        error => {
          console.log('Error creating table:', error);
        },
      );
    });
  }

  // Функция для вставки данных
  public async createItem({
    name,
    value,
  }: {
    name: string;
    value: string;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx: SQLite.Transaction) => {
        tx.executeSql(
          'INSERT INTO items (name, value) VALUES (?, ?)',
          [name, value],
          () => {
            resolve(); // Успешное выполнение
          },
          error => {
            reject(error); // Ошибка
          },
        );
      });
    });
  }

  // Функция для получения всех данных
  public async getItems(): Promise<IDatabaseData[]> {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx: SQLite.Transaction) => {
        tx.executeSql(
          'SELECT * FROM items',
          [],
          (_, {rows}) => {
            resolve(rows.raw()); // Возвращаем данные
          },
          error => {
            reject(error); // Обработка ошибки
          },
        );
      });
    });
  }

  // Функция для получения данных по ID
  public async getItemById(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx: SQLite.Transaction) => {
        tx.executeSql(
          'SELECT * FROM items WHERE id = ?',
          [id],
          (_, {rows}) => {
            if (rows.length > 0) {
              resolve(rows.item(0)); // Возвращаем запись
            } else {
              resolve(null); // Запись не найдена
            }
          },
          error => {
            reject(error); // Обработка ошибки
          },
        );
      });
    });
  }

  // Функция для обновления данных
  public async updateItem({id, name, value}: IDatabaseData): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx: SQLite.Transaction) => {
        tx.executeSql(
          'UPDATE items SET name = ?, value = ? WHERE id = ?',
          [name, value, id],
          () => {
            resolve(); // Успешное выполнение
          },
          error => {
            reject(error); // Ошибка
          },
        );
      });
    });
  }

  // Функция для удаления данных
  public async deleteItem(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx: SQLite.Transaction) => {
        tx.executeSql(
          'DELETE FROM items WHERE id = ?',
          [id],
          () => {
            resolve(); // Успешное выполнение
          },
          error => {
            reject(error); // Ошибка
          },
        );
      });
    });
  }
}

export default new Database(); // Экспортируем экземпляр класса
