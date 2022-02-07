using InterviewTest.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;

namespace InterviewTest.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ListController : ControllerBase
    {
        [HttpGet("query1")]
        public List<Employee> Query1()
        {
            var employees = new List<Employee>();

            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();

                queryCmd.CommandText =
                    @"
                    UPDATE employees SET value = value + 1 WHERE name LIKE 'E%';
                    UPDATE employees SET value = value + 10 WHERE name LIKE 'G%';
                    UPDATE employees SET value = value + 100 WHERE name NOT LIKE 'E%' AND name NOT LIKE 'G%';
                    SELECT Name, Value FROM Employees
                    ";

                using (var reader = queryCmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        employees.Add(new Employee
                        {
                            Name = reader.GetString(0),
                            Value = reader.GetInt32(1)
                        });
                    }
                }
            }

            return employees;
        }

        [HttpGet("query2")]
        public List<Employee> Query2()
        {
            var employees = new List<Employee>();

            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();

                queryCmd.CommandText =
                    @"
                    SELECT Name, SUM(Value) AS 'Value' FROM Employees WHERE Name LIKE 'A%'
                    UNION
                    SELECT Name, SUM(Value) AS 'Value' FROM Employees WHERE Name LIKE 'B%'
                    UNION
                    SELECT Name, SUM(Value) AS 'Value' FROM Employees WHERE Name LIKE 'C%'
                    ";

                using (var reader = queryCmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        employees.Add(new Employee
                        {
                            Name = reader.GetString(0),
                            Value = reader.GetInt32(1)
                        });
                    }
                }
            }

            return employees;
        }



    }
}
