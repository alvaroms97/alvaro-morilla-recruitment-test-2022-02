using InterviewTest.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace InterviewTest.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmployeesController : ControllerBase
    {
        [HttpGet]
        public List<Employee> Get()
        {
            var employees = new List<Employee>();

            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = @"SELECT Name, Value FROM Employees";
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

        [HttpPost("create")]
        public string Post([FromBody] Employee employee)
        {
            try
            {
                var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
                using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
                {
                    connection.Open();

                    var queryCmd = connection.CreateCommand();
                    queryCmd.CommandText = @"INSERT INTO employees(name, value) VALUES(@name, @value)";
                    queryCmd.Parameters.AddWithValue("@name", employee.Name);
                    queryCmd.Parameters.AddWithValue("@value", employee.Value);
                    queryCmd.Prepare();
                    queryCmd.ExecuteNonQuery();
                }

                return JsonConvert.SerializeObject(Ok());
            }
            catch (Exception e)
            {
                return JsonConvert.SerializeObject(BadRequest(e));
            }
        }

        [HttpPut("modify")]
        public string Modify([FromQuery(Name="name")] string name, [FromQuery(Name = "value")] string value, [FromBody] Employee employee)
        {
            try
            {
                var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
                using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
                {
                    connection.Open();

                    var queryCmd = connection.CreateCommand();
                    queryCmd.CommandText = @"UPDATE employees SET name=@name2,value=@value2 WHERE name = @name AND value = @value";
                    queryCmd.Parameters.AddWithValue("@name", name);
                    queryCmd.Parameters.AddWithValue("@value", value);
                    queryCmd.Parameters.AddWithValue("@name2", employee.Name);
                    queryCmd.Parameters.AddWithValue("@value2", employee.Value);
                    queryCmd.Prepare();
                    queryCmd.ExecuteNonQuery();
                }

                return JsonConvert.SerializeObject(Ok());
            }
            catch (Exception e)
            {
                return JsonConvert.SerializeObject(BadRequest(e));
            }
        }

        [HttpDelete("delete")]
        public string Delete([FromQuery(Name = "name")] string name, [FromQuery(Name = "value")] string value)
        {
            try
            {
                var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
                using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
                {
                    connection.Open();

                    var queryCmd = connection.CreateCommand();
                    queryCmd.CommandText = @"DELETE FROM employees WHERE name = @name AND value = @value";
                    queryCmd.Parameters.AddWithValue("@name", name);
                    queryCmd.Parameters.AddWithValue("@value", value);
                    queryCmd.Prepare();
                    queryCmd.ExecuteNonQuery();
                }

                return JsonConvert.SerializeObject(Ok());
            }
            catch (Exception e)
            {
                return JsonConvert.SerializeObject(BadRequest(e));
            }
        }
    }
}
