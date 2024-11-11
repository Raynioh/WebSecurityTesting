import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { User } from './models/user';
import path from 'path';

const databasePath: string = path.join(__dirname, 'database', 'database.db');

export async function selectAllUsers() {
  var users;

  await open({
    filename: databasePath,
    driver: sqlite3.Database
  }).then(async (db) => {
    users = await db.all('SELECT * FROM Users');
  });

  return users;
}

export async function selectAllUsersGoodPasswords() {
  var users;

  await open({
    filename: databasePath,
    driver: sqlite3.Database
  }).then(async (db) => {
    users = await db.all('SELECT * FROM UsersGoodPasswords');
  });

  return users;
}

export async function loadUserVulnerable(username: string) {
  var user: User | undefined;

  await open({
    filename: databasePath,
    driver: sqlite3.Database
  }).then(async (db) => {
    user = await db.get('SELECT * FROM Users WHERE username = \"' + username + '\"');
  });

  return user;
}

export async function loadUserSafe(username: string) {
  var user: User | undefined;

  await open({
    filename: databasePath,
    driver: sqlite3.Database
  }).then(async (db) => {
    user = await db.get('SELECT * FROM Users WHERE username = ?', username);
  });

  return user;
}

export async function loadUserGoodPasswords(username: string) {
  var user: User | undefined;

  await open({
    filename: databasePath,
    driver: sqlite3.Database
  }).then(async (db) => {
    user = await db.get('SELECT * FROM UsersGoodPasswords WHERE username = ?', username);
  });

  return user;
}