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
  public createItem({name: name, value: value}: {name: string; value: string}) {
    this.db.transaction((tx: SQLite.Transaction) => {
      tx.executeSql(
        'INSERT INTO items (name, value) VALUES (?, ?)',
        [name, value],
        () => {
          //   console.log('Data create successfully');
        },
        error => {
          console.log('Error create data:', error);
        },
      );
    });
  }

  // Функция для получения данных
  public getItems(callback: (items: IDatabaseData[]) => void) {
    this.db.transaction((tx: SQLite.Transaction) => {
      tx.executeSql(
        'SELECT * FROM items',
        [],
        (_, {rows}) => {
          //   console.log('Fetched rows:', rows.raw()); // Логируем данные для проверки
          callback(rows.raw()); // Возвращаем результат
        },
        error => {
          console.log('Error fetching data:', error);
        },
      );
    });
  }
  public getItemById(id: number, callback: (item: any) => void) {
    this.db.transaction((tx: SQLite.Transaction) => {
      tx.executeSql(
        'SELECT * FROM items WHERE id = ?', // Запрос с фильтром по ID
        [id], // Передаем ID в запрос
        (_, { rows }) => {
          if (rows.length > 0) {
            callback(rows.item(0)); // Возвращаем объект, если запись найдена
          } else {
            callback(null); // Если записи нет, возвращаем null
          }
        },
        error => {
          console.log('Error fetching item by ID:', error);
          callback(null); // В случае ошибки возвращаем null
        },
      );
    });
  }
  // Функция для обновления данных
  public updateItem({id: id, name: name, value: value}: IDatabaseData) {
    this.db.transaction((tx: SQLite.Transaction) => {
      tx.executeSql(
        'UPDATE items SET name = ?, value = ? WHERE id = ?',
        [name, value, id],
        () => {
          //   console.log('Data updated successfully');
        },
        error => {
          console.log('Error updating data:', error);
        },
      );
    });
  }

  // Функция для удаления данных
  public deleteItem(id: number) {
    this.db.transaction((tx: SQLite.Transaction) => {
      tx.executeSql(
        'DELETE FROM items WHERE id = ?',
        [id],
        () => {
          //   console.log('Data deleted successfully');
        },
        error => {
          console.log('Error deleting data:', error);
        },
      );
    });
  }
}

export default new Database(); // Экспортируем экземпляр класса
