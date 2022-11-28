### Requirements
* .net core 6.0+
* .node.js v.14.17.6
* npm lastest stable
* MS SQL Server

# Application development (Create folder for this project)

### Create Trivia database

# Getting started
This instructins will help you to create MS SQL database and run DatabaseCreateManager project which create and fill database. Please run one of setup scenarios to create Trivia DB.

## Setup

-Copy your MS SQL Server path(connetion string) to `\Entities\Consts\ConnectionString.cs
-Navigate to `\DatabaseCreateManager folder open it with CMD(GitBash) and use following command

```bash command 
dotnet run
```

###Launch client 
This instructins will help you to create and and launch server for client.

##Setup 

-Navigate to `\TriviaGame\clientapp folder open it with CMD(GitBash) and use following command

```bash command 
npm install
npm run dev
```
-Close bash(close session)

##Get server for client
-Have Node.js installed in your system.
-In CMD, run the command npm install http-server -g

#Web Application deployment

##Build ASP .NET Core Web Application
-Navigate to mainfolder project example(D:\Task\..)
- Use the following command to build .net core web application.
```bash
dotnet build --configuration Release
```
Application is compiled to the `\TriviaGame\bin\Release\net6.0\ folder

##Run Server for client
Navigate to the `\TriviaGame\clientapp\dist path of your file folder in CMD as administrator and run the command 

```bash
http-server
```
### Launch Web Application
- Navigate to `%folder_with_compiled_net_application%`
- Use the following command to launch solution:

```bash
dotnet TriviaGame.dll
```
-Open browser and use your localhost
