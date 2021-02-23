## mapping module to global
```bash
$ yarn link
```

## execute command without permission
```bash
$ web-cli
bash: /usr/local/bin/web-cli: Permission denied
```

## grant permission

```bash
$ chmod +x cli.js 
$ ls -l
total 24
-rw-r--r--  1 ts  staff  75 Feb 20 11:42 README.MD
-rwxr-xr-x  1 ts  staff  48 Feb 20 11:41 cli.js
-rw-r--r--  1 ts  staff  88 Feb 20 11:41 package.json
$ web-cli
cli working
```

## project configurations examples

```json
{
  "projects": [
    {
      "name": "ProjectName",
      "local": "dist/",
      "exclude": ["*.gz", "UEditor"],
      "env": {
        "staging": {
          "server": "s32",
          "username": "root",
          "password": "123456",
          "path": "/server-path"
        },
        "rc": {
          "server": "s56",
          "username": "root",
          "path": "/server-path"
        },
        "production": {
          "server": "s56",
          "username": "root",
          "path": "/server-path"
        }
      }
    }
  ]
}

```