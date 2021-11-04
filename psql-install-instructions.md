# PSQL Install instructions

## Mac

- Install Postgres App https://postgresapp.com/
  - Open the app (little blue elephant) and select initialize/start
- type `psql` into your terminal. You should then see something similar to:

```psql
psql (9.6.5, server 9.6.6)
Type "help" for help.

username=#
```

- if the above does not show/you get an error, run the following commands in your terminal:
  - `brew update`
  - `brew doctor`
  - `brew install postgresql`

## Ubuntu

- Run this command in your terminal:
  `sudo apt-get update`

  `sudo apt-get install postgresql postgresql-contrib`

- Next run the following commands to create a database user for Postgres.

  `sudo -u postgres createuser --superuser $USER`

  `sudo -u postgres createdb $USER`

If you see the following error: _`role "username-here" already exists`,_ it means that you already have a Postgres user so can move on to the next step.

If you see the following error: _`Cannot connect to database/server` or similar,_ run `sudo service postgresql start` to ensure that the postgresql server is running before trying the above again.

- Then run this command to enter the terminal application for PostgreSQL:

  `psql`

_You may need to run the following command first to start the PostrgreSQL server in order for the `psql` command to work:_ `sudo service postgresql start`

- Now type:

  `ALTER USER username WITH PASSWORD 'mysecretword123';`

  **BUT** Instead of `username` type your Ubuntu username and instead of `'mysecretword123'` choose your own password and be sure to wrap it in quotation marks. Use a simple password like 'password'. **DONT USE YOUR LOGIN PASSWORD** !

- You can then exit out of psql by typing `\q`

### Storing a Postgres password on Ubuntu

To set a default password to use when running the psql cli you can create a file called `.pgpass` in your home directory. (If you're using macOS this feature comes out of the box so no need to follow these steps)

**tip:** You can navigate to your home directory from any terminal by running cd with no arguments

```bash
cd
```

Create a file called `.pgpass` and open it with a text editor.

```bash
touch .pgpass
```

```bash
code .pgpass
```

The file will be empty when first created, and you should then add a single line with the following format:

```
hostname:port:database:username:password
```

Each field can be a literal value or a wildcard: `*`. We just want to set a password so should add the following to your file (replacing 'mypassword' with your actual password that you created when you ran the `ALTER USER` command):

```
*:*:*:*:mypassword
```

The permissions on `.pgpass` must disallow any access to world or group; You can do this with the following command

```bash
chmod 0600 ~/.pgpass
```

When you run psql it should now use this password as a default so you don't have to provide one on every command.
