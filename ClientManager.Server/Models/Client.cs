﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable enable
using System;
using System.Collections.Generic;

namespace ClientManager.Server.Models;

public partial class Client
{
    public int ClientId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string? CompanyName { get; set; }

    public string? ClientType { get; set; }

    public DateTime? RegistrationDate { get; set; }

    public string? Status { get; set; }

    public string? Notes { get; set; }
}