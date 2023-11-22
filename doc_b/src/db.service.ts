import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2';
import { Connection } from 'mysql2';
import * as dotenv from 'dotenv';

dotenv.config();


type strNumBool = number | string | boolean | null;

interface IConfig {
  onError?: Function
  onSuccess?: Function
}


@Injectable()
export class DBService {

  constructor() {}

  async conn(): Promise<Connection> {
    return new Promise( (res, rej) => {
      const con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
      });

      con.connect(function(error) {
        if (error) {
          rej(error);
        }
        res(con);
      });
    } );
  }

  async q(conn: Connection, query: string, variables: strNumBool[] = [], config: IConfig = {}): Promise<any> {
    return new Promise( (res, rej) => {
      conn.query(query, variables, function(error, result, fields) {
        if (error) {
          if (config.onError) {
            config.onError.call(null, error);
          }

          rej(error);
        }

        if (config.onSuccess) {
          config.onSuccess.call(null, result, fields);
        }

        res(result);
      });
    } );
  }

  async sendQuery(query: string, variables: strNumBool[] = [], config: IConfig = {}): Promise<any> {
    return new Promise( async (res) => {
      let conn: Connection
      let result: any;
      const conf: IConfig = {}

      if (config.onError) {
        conf.onError = config.onError.bind(null);
      }

      if (config.onSuccess) {
        conf.onSuccess = config.onSuccess.bind(null);
      }

      try {
        conn = await this.conn();
        result = await this.q(conn, query, variables, conf);
        await this.close(conn);
      } catch (e) {
        console.log(e);
        console.log('--- query ---');
        console.log(query)
        console.log(variables)
        console.log('--- END query ---');
        try {
          this.close(conn);
        } catch (e) {
          console.error(e);
        }
      } finally {
        res(result);
      }
    } );
  }

  async close(conn: Connection): Promise<void | never> {
    return new Promise( (res, rej) => {
      conn.end(function(error) {
        if (error) {
          rej(error);
        }

        res(null);
      });
    } );
  }
}