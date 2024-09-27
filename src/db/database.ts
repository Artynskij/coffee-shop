import SQLite from 'react-native-sqlite-storage';

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
  public createItem(name: string, value: string) {
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
  public getItems(callback: (items: any[]) => void) {
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

  // Функция для обновления данных
  public updateItem(id: number, name: string, value: string) {
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
