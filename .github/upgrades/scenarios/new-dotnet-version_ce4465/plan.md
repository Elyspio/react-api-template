# .NET 10.0 Upgrade Plan

## Table of Contents

- [Executive Summary](#executive-summary)
- [Migration Strategy](#migration-strategy)
- [Detailed Dependency Analysis](#detailed-dependency-analysis)
- [Aspire Integration Strategy](#aspire-integration-strategy)
- [Project-by-Project Migration Plans](#project-by-project-migration-plans)
- [Package Update Reference](#package-update-reference)
- [Breaking Changes Catalog](#breaking-changes-catalog)
- [Testing & Validation Strategy](#testing--validation-strategy)
- [Risk Management](#risk-management)
- [Complexity & Effort Assessment](#complexity--effort-assessment)
- [Source Control Strategy](#source-control-strategy)
- [Success Criteria](#success-criteria)

---

## Executive Summary

### Upgrade Overview

**From:** .NET 9.0  
**To:** .NET 10.0 (LTS)  
**Strategy:** All-at-Once Migration  
**Scope:** 5 projects + Aspire integration + MongoDB + NPM frontend orchestration

This plan outlines the coordinated upgrade of all 5 projects in the solution from .NET 9.0 to .NET 10.0 LTS, along with implementing .NET Aspire for modern cloud-native orchestration. The solution follows a clean architecture with low complexity and excellent package compatibility, making this a straightforward upgrade.

### Key Metrics

| Metric | Value |
|--------|-------|
| **Total Projects** | 5 |
| **Total Files** | 96 |
| **Total LOC** | 4,408 |
| **LOC to Modify** | ~158 (3.6%) |
| **Total Issues** | 183 (19 mandatory, 157 potential, 2 optional) |
| **Package Updates** | 9 recommended, 2 deprecated, 2 to remove |
| **Binary Breaking Changes** | 12 |
| **Behavioral Changes** | 146 |
| **Complexity** | Low across all projects |

### Solution Architecture

```
Level 0: Abstractions (foundation layer)
         ├── 27 files, 1,800 LOC
         └── Issues: 11 (3 mandatory)

Level 1: Adapters & Core (middle tier)
         ├── Mongo Adapter: 3 files, 116 LOC, 3 issues
         ├── Rest Adapter: 4 files, 262 LOC, 157 issues  
         └── Core: 26 files, 1,140 LOC, 6 issues

Level 2: Web (top-level application)
         └── 36 files, 1,090 LOC, 6 issues
```

### Migration Highlights

✅ **Low Risk Factors:**
- Already on modern .NET (9.0 → 10.0 is a single version jump)
- All projects are SDK-style (no conversion needed)
- Simple, clean dependency structure
- High package compatibility (82% compatible as-is)
- No security vulnerabilities reported
- Small codebase with low complexity

⚠️ **Areas Requiring Attention:**
- 2 deprecated packages need replacement:
  - `Microsoft.AspNetCore.Mvc.Core` (v2.2.5)
  - `System.IdentityModel.Tokens.Jwt` (v7.6.2)
- 2 packages now in framework (remove):
  - `System.ComponentModel.Annotations`
  - `System.Net.Http`
- 12 binary breaking API changes (primarily in IdentityModel)
- 146 behavioral changes (mostly in Rest adapter)

🚀 **Aspire Integration:**
- Add .NET Aspire AppHost project
- Configure MongoDB resource
- Integrate NPM frontend project (../front)
- Setup service defaults and orchestration

### Estimated Effort

| Task | Complexity | Time Estimate |
|------|-----------|---------------|
| Update target frameworks | Low | 15 min |
| Update NuGet packages | Low | 20 min |
| Remove deprecated packages | Low-Medium | 30 min |
| Fix binary breaking changes | Low-Medium | 45 min |
| Review behavioral changes | Medium | 60 min |
| Add Aspire projects | Low | 30 min |
| Configure MongoDB resource | Low | 15 min |
| Integrate NPM frontend | Low-Medium | 30 min |
| Build & test validation | Low | 30 min |
| **Total** | **Low** | **~4 hours** |

### Success Criteria

1. ✅ All 5 projects target `net10.0`
2. ✅ All NuGet packages updated to compatible versions
3. ✅ Deprecated packages replaced/removed
4. ✅ Solution builds with 0 errors, 0 warnings
5. ✅ All tests pass (if present)
6. ✅ Aspire AppHost successfully orchestrates:
   - MongoDB container
   - NPM frontend (../front)
   - .NET API projects
7. ✅ Application runs and functions correctly
8. ✅ Changes committed to `upgrade-to-NET10` branch

---

## Migration Strategy

### Chosen Strategy: All-at-Once Migration

Given the characteristics of this solution, an **All-at-Once** strategy is optimal:

**Rationale:**
- ✅ Small solution (5 projects)
- ✅ Already on modern .NET (9.0 → 10.0 single version jump)
- ✅ Simple dependency structure (2-level depth)
- ✅ Low complexity across all projects
- ✅ High package compatibility (22/27 packages compatible as-is)
- ✅ No security vulnerabilities
- ✅ Clean architecture with clear separation

**Advantages:**
- Simpler coordination (one migration phase)
- Shorter overall timeline
- Single testing cycle
- Easier rollback if needed
- Less overhead maintaining multiple branches

**Alternative Considered: Incremental**
- Not needed due to low risk profile
- Would add unnecessary complexity
- Solution is small enough to handle atomically

### Migration Phases

#### Phase 1: Preparation & Setup (Pre-migration)
1. Validate .NET 10 SDK installation
2. Create/switch to `upgrade-to-NET10` branch
3. Document current state (baselines)
4. Review breaking changes catalog

#### Phase 2: Framework & Package Updates
1. Update all project target frameworks to `net10.0`
2. Update NuGet packages (9 packages)
3. Remove deprecated packages:
   - Replace `Microsoft.AspNetCore.Mvc.Core` functionality
   - Replace `System.IdentityModel.Tokens.Jwt` with modern alternative
4. Remove framework-included packages:
   - `System.ComponentModel.Annotations`
   - `System.Net.Http`

#### Phase 3: Code Fixes
1. Address binary breaking changes (12 occurrences, primarily IdentityModel)
2. Review and test behavioral changes (146 occurrences, primarily Rest adapter)
3. Update any deprecated API usage

#### Phase 4: Aspire Integration
1. Add Aspire AppHost project
2. Add ServiceDefaults project
3. Configure MongoDB resource in AppHost
4. Configure NPM project resource (../front)
5. Register API projects with AppHost
6. Update Web project to use ServiceDefaults

#### Phase 5: Validation & Testing
1. Build all projects (0 errors, 0 warnings)
2. Run existing tests
3. Test Aspire orchestration:
   - MongoDB startup
   - NPM frontend startup
   - API connectivity
4. Smoke test application functionality

#### Phase 6: Finalization
1. Commit changes to `upgrade-to-NET10` branch
2. Document any runtime behavior changes
3. Update README/documentation if needed

### Execution Order

**Bottom-Up Dependency Order:**

```
1. Abstractions (Level 0 - no dependencies)
   └─ Foundation types, interfaces, extensions

2. Parallel: Mongo, Rest, Core (Level 1)
   ├─ Mongo Adapter
   ├─ Rest Adapter  
   └─ Core Business Logic

3. Web (Level 2 - consumes all)
   └─ ASP.NET Core API

4. Aspire Projects (New)
   ├─ ServiceDefaults
   └─ AppHost
```

### Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Breaking changes in IdentityModel APIs | Medium | Medium | Review replacement APIs, test authentication flows |
| Behavioral changes in Rest adapter | Medium | Low | Review 146 changes, focus on HttpClient/serialization |
| Deprecated package replacements | Low | Medium | Use modern Microsoft.* equivalents |
| Aspire configuration issues | Low | Low | Follow official templates and docs |
| MongoDB connection issues | Low | Low | Test connection strings, use Aspire resource config |
| NPM frontend integration | Low | Medium | Ensure correct path (../front), verify npm commands |

### Rollback Plan

If critical issues are encountered:
1. Git checkout original branch (`master`)
2. All changes isolated to `upgrade-to-NET10` branch
3. No production impact (development branch only)
4. Can investigate issues without time pressure

---

## Detailed Dependency Analysis

### Project Dependency Graph

```
┌─────────────────────────────────────────────────────────────┐
│ Level 0: Foundation (No Dependencies)                       │
└─────────────────────────────────────────────────────────────┘

  Example.Api.Abstractions
  ├─ Type: ClassLibrary
  ├─ Current TFM: net9.0
  ├─ Files: 27 | LOC: 1,800 | Complexity: Low
  ├─ Issues: 11 (3 mandatory, 5 potential, 2 optional)
  └─ Used by: Web, Core, Mongo, Rest

┌─────────────────────────────────────────────────────────────┐
│ Level 1: Adapters & Core (Single Dependency)                │
└─────────────────────────────────────────────────────────────┘

  Example.Api.Adapters.Mongo
  ├─ Type: ClassLibrary
  ├─ Current TFM: net9.0
  ├─ Files: 3 | LOC: 116 | Complexity: Low
  ├─ Issues: 3 (2 mandatory, 0 potential, 1 optional)
  ├─ Dependencies: Abstractions
  └─ Used by: Web

  Example.Api.Adapters.Rest
  ├─ Type: ClassLibrary
  ├─ Current TFM: net9.0
  ├─ Files: 4 | LOC: 262 | Complexity: Low
  ├─ Issues: 157 (8 mandatory, 146 potential, 1 optional)
  ├─ Dependencies: Abstractions
  ├─ Used by: Web
  └─ ⚠️ High issue count (behavioral changes in HTTP/serialization)

  Example.Api.Core
  ├─ Type: ClassLibrary
  ├─ Current TFM: net9.0
  ├─ Files: 26 | LOC: 1,140 | Complexity: Low
  ├─ Issues: 6 (3 mandatory, 2 potential, 1 optional)
  ├─ Dependencies: Abstractions
  └─ Used by: Web

┌─────────────────────────────────────────────────────────────┐
│ Level 2: Application (Multiple Dependencies)                 │
└─────────────────────────────────────────────────────────────┘

  Example.Api.Web
  ├─ Type: AspNetCore
  ├─ Current TFM: net9.0
  ├─ Files: 36 | LOC: 1,090 | Complexity: Low
  ├─ Issues: 6 (3 mandatory, 2 potential, 1 optional)
  ├─ Dependencies: Abstractions, Rest, Core, Mongo
  └─ Entry point application

┌─────────────────────────────────────────────────────────────┐
│ Level 3: Aspire Orchestration (To Be Added)                 │
└─────────────────────────────────────────────────────────────┘

  Example.Api.ServiceDefaults (NEW)
  ├─ Type: ClassLibrary
  ├─ Target TFM: net10.0
  └─ Purpose: Shared Aspire service configuration

  Example.Api.AppHost (NEW)
  ├─ Type: Aspire AppHost
  ├─ Target TFM: net10.0
  ├─ Dependencies: Web
  └─ Resources: MongoDB, NPM frontend
```

### Migration Sequence

**Order of Operations:**

1. **Abstractions** (Level 0)
   - No dependencies → safe to update first
   - All other projects depend on this
   - Must be stable before proceeding

2. **Mongo, Rest, Core** (Level 1) - Can be done in parallel
   - Each only depends on Abstractions
   - Independent of each other
   - Can parallelize for efficiency

3. **Web** (Level 2)
   - Update last since it depends on all others
   - Integration point for all layers
   - Entry point for application

4. **Aspire Projects** (Level 3) - After Web is stable
   - Add ServiceDefaults
   - Add AppHost
   - Configure resources

### Package Dependencies

**Shared Packages (across multiple projects):**
- Microsoft.Extensions.* (Configuration, DI, Logging, Http) → Update to 10.0.3
- Newtonsoft.Json → Update to 13.0.4
- Serilog.* → Already compatible

**Project-Specific Packages:**
- **Abstractions**: MongoDB.Bson, System.IdentityModel.Tokens.Jwt (deprecated), Mvc.Core (deprecated)
- **Mongo**: MongoDB.Driver (compatible)
- **Rest**: AspNetCore.Mvc.NewtonsoftJson, Polly, System.ComponentModel.Annotations (remove)
- **Core**: System.Runtime.Caching
- **Web**: Swashbuckle, Serilog.AspNetCore

**Aspire Packages (to be added):**
- Aspire.Hosting.AppHost
- Aspire.Hosting.MongoDB
- Aspire.Hosting.NodeJs (for NPM frontend)
- Microsoft.Extensions.ServiceDiscovery

### Cross-Project Impact Analysis

| Change Type | Abstractions | Mongo | Rest | Core | Web |
|-------------|-------------|-------|------|------|-----|
| Target Framework | ✅ Update | ✅ Update | ✅ Update | ✅ Update | ✅ Update |
| Package Updates | 4 packages | 0 packages | 3 packages | 1 package | 1 package |
| Deprecated Packages | 2 packages | - | - | - | - |
| Framework Packages | - | - | 1 package | - | - |
| API Breaking Changes | 2 APIs | - | 8 APIs | - | - |
| Behavioral Changes | 1 | - | 146 | - | - |

**Critical Path:**
```
Abstractions (IdentityModel fixes) 
    → Rest (HTTP/serialization changes)
        → Web (integration & Aspire setup)
            → AppHost (orchestration)
```

---

## Aspire Integration Strategy

### Overview

.NET Aspire is a cloud-native application stack for building observable, production-ready distributed applications. We'll integrate Aspire to orchestrate:
- The .NET API backend (Example.Api.Web)
- MongoDB database server
- NPM frontend application (located at ../front)

### Aspire Project Structure

```
ExampleApi.sln
├── Abstractions/
├── Core/
├── Db/
├── Rest/
├── Web/
├── ServiceDefaults/          ← NEW: Shared service configuration
│   ├── Extensions.cs
│   └── ServiceDefaults.csproj
└── AppHost/                  ← NEW: Orchestration host
    ├── Program.cs
    └── AppHost.csproj

front/                        ← EXISTING: NPM project (outside back/)
└── package.json
```

### Implementation Steps

#### Step 1: Create ServiceDefaults Project

**Purpose:** Centralize common service configuration (OpenTelemetry, health checks, service discovery)

**File:** `ServiceDefaults/ServiceDefaults.csproj`
```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.Extensions.Http.Resilience" Version="10.0.3" />
    <PackageReference Include="Microsoft.Extensions.ServiceDiscovery" Version="10.0.3" />
    <PackageReference Include="OpenTelemetry.Exporter.OpenTelemetryProtocol" Version="1.10.0" />
    <PackageReference Include="OpenTelemetry.Extensions.Hosting" Version="1.10.0" />
    <PackageReference Include="OpenTelemetry.Instrumentation.AspNetCore" Version="1.10.0" />
    <PackageReference Include="OpenTelemetry.Instrumentation.Http" Version="1.10.0" />
    <PackageReference Include="OpenTelemetry.Instrumentation.Runtime" Version="1.10.0" />
  </ItemGroup>
</Project>
```

**File:** `ServiceDefaults/Extensions.cs`
- Add `AddServiceDefaults()` extension method
- Configure OpenTelemetry, health checks, service discovery
- Setup resilience patterns

#### Step 2: Create AppHost Project

**Purpose:** Orchestrate all services and resources

**File:** `AppHost/AppHost.csproj`
```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net10.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
    <IsAspireHost>true</IsAspireHost>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Aspire.Hosting.AppHost" Version="10.0.3" />
    <PackageReference Include="Aspire.Hosting.MongoDB" Version="10.0.3" />
    <PackageReference Include="Aspire.Hosting.NodeJs" Version="10.0.3" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\Web\Example.Api.Web.csproj" />
  </ItemGroup>
</Project>
```

**File:** `AppHost/Program.cs`
```csharp
var builder = DistributedApplication.CreateBuilder(args);

// MongoDB resource
var mongo = builder.AddMongoDB("mongodb")
                   .WithDataVolume()
                   .AddDatabase("example-db");

// NPM Frontend (React app)
var frontend = builder.AddNpmApp("frontend", "../../front")
                      .WithHttpEndpoint(port: 3000, env: "PORT")
                      .WithExternalHttpEndpoints()
                      .PublishAsDockerFile();

// .NET API
var api = builder.AddProject<Projects.Example_Api_Web>("api")
                 .WithReference(mongo)
                 .WithEnvironment("MongoDB__ConnectionString", mongo.Resource.ConnectionStringExpression);

// Allow frontend to call API
frontend.WithEnvironment("REACT_APP_API_URL", api.GetEndpoint("http"));

builder.Build().Run();
```

#### Step 3: Update Web Project

**Modify:** `Web/Example.Api.Web.csproj`
```xml
<!-- Add Aspire packages -->
<ItemGroup>
  <ProjectReference Include="..\ServiceDefaults\ServiceDefaults.csproj" />
</ItemGroup>
```

**Modify:** `Web/Program.cs`
```csharp
var builder = WebApplication.CreateBuilder(args);

// Add Aspire service defaults (first!)
builder.AddServiceDefaults();

// ... existing configuration ...

var app = builder.Build();

// Map Aspire health checks
app.MapDefaultEndpoints();

// ... existing middleware ...

app.Run();
```

#### Step 4: Update MongoDB Configuration

**Current:** Web project likely has hardcoded MongoDB connection string

**New Approach:** Use Aspire service discovery

**Before:**
```csharp
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var connectionString = builder.Configuration["MongoDB:ConnectionString"];
    return new MongoClient(connectionString);
});
```

**After:**
```csharp
// Aspire automatically injects the connection string via environment variable
// or use service discovery:
builder.AddMongoDBClient("mongodb");
```

#### Step 5: Configure NPM Frontend

**Requirements for ../front:**
1. Valid `package.json` with scripts:
   - `"start"` or `"dev"` for development
   - `"build"` for production
2. Environment variable support for API URL

**Example frontend .env usage:**
```env
REACT_APP_API_URL=http://localhost:5000
```

Aspire will automatically set this based on the API's actual endpoint.

### Resource Configuration

#### MongoDB Resource Options

```csharp
var mongo = builder.AddMongoDB("mongodb")
    .WithDataVolume()              // Persist data across restarts
    .WithLifetime(ContainerLifetime.Persistent)  // Keep container running
    .AddDatabase("example-db");     // Create specific database
```

**Connection String:** Automatically generated and injected as:
- `ConnectionStrings__mongodb` environment variable
- Available to .NET projects via `builder.Configuration.GetConnectionString("mongodb")`

#### NPM Frontend Options

```csharp
var frontend = builder.AddNpmApp("frontend", "../../front")
    .WithHttpEndpoint(port: 3000, env: "PORT")  // Expose on port 3000
    .WithExternalHttpEndpoints()                 // Allow external access
    .WithEnvironment("REACT_APP_API_URL", api.GetEndpoint("http"))
    .PublishAsDockerFile();                      // Optional: containerize
```

**Key Features:**
- Automatically runs `npm install` if needed
- Runs `npm start` or `npm run dev`
- Monitors for changes
- Provides logs in Aspire dashboard

### Testing Aspire Integration

1. **Run AppHost:**
   ```bash
   dotnet run --project AppHost/AppHost.csproj
   ```

2. **Aspire Dashboard:** Opens automatically at `http://localhost:15888` (or similar)
   - View all resources (MongoDB, API, Frontend)
   - See logs, metrics, traces
   - Monitor health checks

3. **Access Services:**
   - Frontend: `http://localhost:3000` (or assigned port)
   - API: `http://localhost:5000` (or assigned port)
   - Dashboard shows actual URLs

### Benefits

✅ **Unified Development Experience:**
- Single command starts all services
- Automatic service discovery
- Centralized logging and tracing

✅ **Production-Ready Patterns:**
- OpenTelemetry out-of-the-box
- Health checks
- Resilience patterns

✅ **Container Orchestration:**
- MongoDB runs in container
- No manual setup required
- Consistent across dev environments

✅ **Environment Parity:**
- Dev/staging/prod use same patterns
- Configuration-driven differences
- Easy cloud deployment (Azure Container Apps, Kubernetes)

### Migration Checklist

- [ ] Create ServiceDefaults project
- [ ] Create AppHost project
- [ ] Add ServiceDefaults reference to Web
- [ ] Update Web/Program.cs to use `AddServiceDefaults()`
- [ ] Configure MongoDB resource in AppHost
- [ ] Configure NPM frontend resource in AppHost
- [ ] Test `dotnet run --project AppHost` starts all services
- [ ] Verify Aspire dashboard shows all resources healthy
- [ ] Test API → MongoDB connectivity
- [ ] Test Frontend → API connectivity
- [ ] Update solution file to include new projects
- [ ] Update README with Aspire instructions

---

## Project-by-Project Migration Plans

### 1. Example.Api.Abstractions (Level 0)

**Overview:**
- **Type:** ClassLibrary
- **Current TFM:** net9.0 → **Target:** net10.0
- **Files:** 27 | **LOC:** 1,800 | **Complexity:** Low
- **Issues:** 11 (3 mandatory, 5 potential, 2 optional)

**Dependencies:** None (foundation layer)

**Migration Tasks:**

#### 1.1 Update Target Framework
```xml
<TargetFramework>net10.0</TargetFramework>
```

#### 1.2 Update NuGet Packages
| Package | Current | New | Action |
|---------|---------|-----|--------|
| Microsoft.Extensions.Configuration.Abstractions | 8.0.0 | 10.0.3 | Update |
| Microsoft.Extensions.DependencyInjection.Abstractions | 8.0.1 | 10.0.3 | Update |
| Microsoft.Extensions.Logging.Abstractions | 8.0.1 | 10.0.3 | Update |
| Newtonsoft.Json | 13.0.3 | 13.0.4 | Update |

#### 1.3 Replace Deprecated Packages

**⚠️ Microsoft.AspNetCore.Mvc.Core (2.2.5 → REMOVE)**
- **Status:** Deprecated since .NET 5
- **Reason:** Legacy ASP.NET Core 2.2 package
- **Solution:** Remove package, functionality included in framework
- **Files to Check:** Look for `using Microsoft.AspNetCore.Mvc.Core` imports

**⚠️ System.IdentityModel.Tokens.Jwt (7.6.2 → 8.16.0)**
- **Status:** Deprecated, migrate to new LTS version
- **Breaking Changes:**
  - `JwtSecurityTokenHandler` replaced with `JsonWebTokenHandler`
  - `ValidateToken` signature changed
- **Files Affected:**
  - `Abstractions/Interfaces/Adapters/IJwtAdapter.cs` (line 6)
  - `Abstractions/Interfaces/Services/IAuthenticationService.cs` (line 6)

#### 1.4 Fix Binary Breaking Changes

**JwtSecurityToken Type (2 occurrences)**

**File:** `Abstractions/Interfaces/Adapters/IJwtAdapter.cs`, line 6
```csharp
// OLD (will not compile):
bool ValidateJwt(string? token, out JwtSecurityToken? validatedToken);

// NEW (modern approach):
bool ValidateJwt(string? token, out JsonWebToken? validatedToken);
// OR keep signature but update implementation to use JsonWebTokenHandler
```

**File:** `Abstractions/Interfaces/Services/IAuthenticationService.cs`, line 6
- Same fix as above

#### 1.5 Review Behavioral Changes

**File:** `Abstractions/Common/Technical/Tracing/Base/TracingContext.cs`, line 23
- **API:** `ActivitySource.StartActivity(string, ActivityKind)`
- **Change:** Behavioral change in .NET 10
- **Action:** Review and test tracing functionality
- **Impact:** Low (likely no code changes needed, just testing)

#### 1.6 Validation
- Build project: `dotnet build Abstractions/Example.Api.Abstractions.csproj`
- Expected: 0 errors, 0 warnings
- Run tests if available

---

### 2. Example.Api.Adapters.Mongo (Level 1)

**Overview:**
- **Type:** ClassLibrary
- **Current TFM:** net9.0 → **Target:** net10.0
- **Files:** 3 | **LOC:** 116 | **Complexity:** Low
- **Issues:** 3 (2 mandatory, 0 potential, 1 optional)

**Dependencies:** Abstractions

**Migration Tasks:**

#### 2.1 Update Target Framework
```xml
<TargetFramework>net10.0</TargetFramework>
```

#### 2.2 Package Updates
- **MongoDB.Driver (2.26.0):** ✅ Already compatible, no update needed

#### 2.3 Validation
- Build project: `dotnet build Db/Example.Api.Adapters.Mongo.csproj`
- Verify MongoDB connectivity (handled by Aspire later)
- Expected: 0 errors, 0 warnings

---

### 3. Example.Api.Adapters.Rest (Level 1)

**Overview:**
- **Type:** ClassLibrary
- **Current TFM:** net9.0 → **Target:** net10.0
- **Files:** 4 | **LOC:** 262 | **Complexity:** Low
- **Issues:** 157 (8 mandatory, 146 potential, 1 optional)

**Dependencies:** Abstractions

**⚠️ Most Complex Project:** 146 behavioral changes (primarily in HTTP/serialization)

**Migration Tasks:**

#### 3.1 Update Target Framework
```xml
<TargetFramework>net10.0</TargetFramework>
```

#### 3.2 Update NuGet Packages
| Package | Current | New | Action |
|---------|---------|-----|--------|
| Microsoft.Extensions.Configuration.Binder | 8.0.1 | 10.0.3 | Update |
| Microsoft.Extensions.Http | 8.0.0 | 10.0.3 | Update |
| Newtonsoft.Json | 13.0.3 | 13.0.4 | Update |

#### 3.3 Remove Framework-Included Packages
| Package | Current | Action | Reason |
|---------|---------|--------|--------|
| System.ComponentModel.Annotations | 5.0.0 | REMOVE | Included in .NET 10 framework |
| System.Net.Http | 4.3.4 | REMOVE | Included in .NET 10 framework |

**Steps:**
1. Remove `<PackageReference>` entries from .csproj
2. Build should still work (types are in framework)

#### 3.4 Fix Binary Breaking Changes (8 occurrences)

**1. ServiceCollectionExtensions (Scrutor library)**
- **File:** `Rest/Injections/RestAdapterModule.cs`, line 18
- **Issue:** Scrutor assembly scanning API changed
- **Current Code:**
  ```csharp
  services.Scan(s => s.FromAssemblyOf<RestAdapterModule>()
      .AddClasses(c => c.InNamespaceOf<JwtAdapter>())
      .AsImplementedInterfaces()
      .WithSingletonLifetime()
  );
  ```
- **Action:** Verify Scrutor 4.2.2 is compatible with .NET 10 (likely no change needed)

**2-5. JwtSecurityToken & JwtSecurityTokenHandler**
- **File:** `Rest/Adapters/JwtAdapter.cs`
- **Lines:** 23, 35, 39
- **Migration Required:**

```csharp
// OLD:
using System.IdentityModel.Tokens.Jwt;

public bool ValidateJwt(string? token, out JwtSecurityToken? validatedToken)
{
    var tokenHandler = new JwtSecurityTokenHandler();
    tokenHandler.ValidateToken(token, validationParameters, out var securityToken);
    validatedToken = securityToken as JwtSecurityToken;
}

// NEW (Option 1 - use modern JsonWebTokenHandler):
using Microsoft.IdentityModel.JsonWebTokens;

public bool ValidateJwt(string? token, out JsonWebToken? validatedToken)
{
    var tokenHandler = new JsonWebTokenHandler();
    var result = tokenHandler.ValidateToken(token, validationParameters);
    validatedToken = result.IsValid ? result.Token as JsonWebToken : null;
    return result.IsValid;
}

// NEW (Option 2 - keep old API but update implementation):
// Update package to System.IdentityModel.Tokens.Jwt 8.16.0
// Minimal code changes required
```

**Recommendation:** Use Option 2 for faster migration, refactor to Option 1 later

#### 3.5 Review Behavioral Changes (146 occurrences)

**Primary Areas:**

**A. HttpContent APIs (144 occurrences)**
- **File:** `Rest/Connected Services/AuthenticationApi/AuthenticationApi.cs`
- **APIs:**
  - `HttpContent.ReadAsStreamAsync()`
  - `HttpContent.ReadAsStringAsync()`
- **Changes:** These methods now have cancellation token overloads and improved async behavior
- **Action:**
  - Review auto-generated API client code
  - Consider regenerating with latest NSwag/OpenAPI tools
  - Test HTTP calls thoroughly

**Example:**
```csharp
// Old (still works):
var stream = await response.Content.ReadAsStreamAsync().ConfigureAwait(false);

// New (recommended):
var stream = await response.Content.ReadAsStreamAsync(cancellationToken).ConfigureAwait(false);
```

**B. Uri Constructor (2 occurrences)**
- **File:** `Rest/Injections/RestAdapterModule.cs`, line 16
- **Code:** `new Uri(conf.Authentication)`
- **Change:** Stricter validation in .NET 10
- **Action:** Ensure `conf.Authentication` is a valid URI string, add validation if needed

#### 3.6 Validation
- Build project: `dotnet build Rest/Example.Api.Adapters.Rest.csproj`
- Run unit tests for JWT validation
- Test HTTP client functionality
- Expected: 0 errors, 0-2 warnings (informational)

---

### 4. Example.Api.Core (Level 1)

**Overview:**
- **Type:** ClassLibrary
- **Current TFM:** net9.0 → **Target:** net10.0
- **Files:** 26 | **LOC:** 1,140 | **Complexity:** Low
- **Issues:** 6 (3 mandatory, 2 potential, 1 optional)

**Dependencies:** Abstractions

**Migration Tasks:**

#### 4.1 Update Target Framework
```xml
<TargetFramework>net10.0</TargetFramework>
```

#### 4.2 Update NuGet Packages
| Package | Current | New | Action |
|---------|---------|-----|--------|
| System.Runtime.Caching | 8.0.0 | 10.0.3 | Update |

#### 4.3 Validation
- Build project: `dotnet build Core/Example.Api.Core.csproj`
- Test caching functionality if used
- Expected: 0 errors, 0 warnings

---

### 5. Example.Api.Web (Level 2)

**Overview:**
- **Type:** AspNetCore (Web API)
- **Current TFM:** net9.0 → **Target:** net10.0
- **Files:** 36 | **LOC:** 1,090 | **Complexity:** Low
- **Issues:** 6 (3 mandatory, 2 potential, 1 optional)

**Dependencies:** Abstractions, Rest, Core, Mongo

**Migration Tasks:**

#### 5.1 Update Target Framework
```xml
<TargetFramework>net10.0</TargetFramework>
```

#### 5.2 Update NuGet Packages
| Package | Current | New | Action |
|---------|---------|-----|--------|
| Microsoft.AspNetCore.Mvc.NewtonsoftJson | 8.0.6 | 10.0.3 | Update |
| Microsoft.Extensions.Logging.Configuration | 8.0.0 | 10.0.3 | Update |

#### 5.3 Add Aspire Integration

**Add ServiceDefaults Reference:**
```xml
<ProjectReference Include="..\ServiceDefaults\ServiceDefaults.csproj" />
```

**Update Program.cs:**
```csharp
var builder = WebApplication.CreateBuilder(args);

// Add Aspire service defaults (FIRST!)
builder.AddServiceDefaults();

// ... existing configuration ...
builder.Services.AddControllers();
builder.Services.AddSwaggerGen();
// etc.

var app = builder.Build();

// Map Aspire default endpoints (health, metrics)
app.MapDefaultEndpoints();

// ... existing middleware ...
app.UseSwagger();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

#### 5.4 Update MongoDB Configuration

**Before:**
```csharp
// Hardcoded or appsettings.json
var connectionString = builder.Configuration["MongoDB:ConnectionString"];
services.AddSingleton<IMongoClient>(new MongoClient(connectionString));
```

**After (Aspire):**
```csharp
// Aspire automatically provides connection string via service discovery
builder.AddMongoDBClient("mongodb");
// Connection string from AppHost: ConnectionStrings__mongodb
```

#### 5.5 Validation
- Build project: `dotnet build Web/Example.Api.Web.csproj`
- Run application: `dotnet run --project Web/Example.Api.Web.csproj`
- Test Swagger UI: `http://localhost:5000/swagger`
- Test endpoints
- Expected: 0 errors, 0 warnings

---

### 6. ServiceDefaults (NEW - Level 3)

**Create New Project:**
```bash
dotnet new classlib -n ServiceDefaults -o ServiceDefaults -f net10.0
```

**Add to solution:**
```bash
dotnet sln add ServiceDefaults/ServiceDefaults.csproj
```

**Files to Create:**
1. `ServiceDefaults.csproj` - See Aspire Integration Strategy section
2. `Extensions.cs` - Implement `AddServiceDefaults()` extension

**Template for Extensions.cs:**
```csharp
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Logging;
using OpenTelemetry;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;

namespace ServiceDefaults;

public static class Extensions
{
    public static IHostApplicationBuilder AddServiceDefaults(this IHostApplicationBuilder builder)
    {
        builder.ConfigureOpenTelemetry();
        builder.AddDefaultHealthChecks();
        builder.Services.AddServiceDiscovery();
        return builder;
    }

    public static IHostApplicationBuilder ConfigureOpenTelemetry(this IHostApplicationBuilder builder)
    {
        builder.Services.AddOpenTelemetry()
            .WithMetrics(metrics =>
            {
                metrics.AddAspNetCoreInstrumentation()
                       .AddHttpClientInstrumentation()
                       .AddRuntimeInstrumentation();
            })
            .WithTracing(tracing =>
            {
                tracing.AddAspNetCoreInstrumentation()
                       .AddHttpClientInstrumentation();
            });

        builder.Services.AddOpenTelemetry()
            .UseOtlpExporter();

        return builder;
    }

    public static IHostApplicationBuilder AddDefaultHealthChecks(this IHostApplicationBuilder builder)
    {
        builder.Services.AddHealthChecks()
            .AddCheck("self", () => HealthCheckResult.Healthy(), ["live"]);

        return builder;
    }

    public static WebApplication MapDefaultEndpoints(this WebApplication app)
    {
        app.MapHealthChecks("/health");
        app.MapHealthChecks("/alive", new HealthCheckOptions
        {
            Predicate = r => r.Tags.Contains("live")
        });

        return app;
    }
}
```

---

### 7. AppHost (NEW - Level 3)

**Create New Project:**
```bash
dotnet new aspire-apphost -n AppHost -o AppHost
```

**Add to solution:**
```bash
dotnet sln add AppHost/AppHost.csproj
```

**Program.cs Implementation:**
- See Aspire Integration Strategy section for complete code

**Key Configuration:**
1. MongoDB resource with data volume
2. NPM frontend resource (../../front)
3. .NET API reference with MongoDB connection
4. Cross-service environment variables

---

### Summary: Migration Order

1. ✅ **Abstractions** - Update framework, packages, fix JWT types
2. ✅ **Mongo** - Update framework (simple)
3. ✅ **Rest** - Update framework, packages, remove deprecated, fix JWT & HTTP
4. ✅ **Core** - Update framework, package
5. ✅ **Web** - Update framework, packages, add Aspire integration
6. ✅ **ServiceDefaults** - Create new project
7. ✅ **AppHost** - Create new project, configure resources

**Estimated Time per Project:**
- Abstractions: 45 min
- Mongo: 10 min
- Rest: 60 min
- Core: 10 min
- Web: 30 min
- ServiceDefaults: 20 min
- AppHost: 30 min
- **Total: ~3.5 hours**

---

## Package Update Reference

### Update Strategy

**All package updates should be done after target framework update** to ensure compatibility checks are accurate.

### Packages Requiring Updates

| Package | Current | New | Projects Affected | Priority | Notes |
|---------|---------|-----|-------------------|----------|-------|
| **Microsoft.Extensions.Configuration.Abstractions** | 8.0.0 | 10.0.3 | Abstractions | High | Core dependency |
| **Microsoft.Extensions.DependencyInjection.Abstractions** | 8.0.1 | 10.0.3 | Abstractions | High | Core dependency |
| **Microsoft.Extensions.Logging.Abstractions** | 8.0.1 | 10.0.3 | Abstractions | High | Core dependency |
| **Microsoft.Extensions.Configuration.Binder** | 8.0.1 | 10.0.3 | Rest | High | Configuration binding |
| **Microsoft.Extensions.Http** | 8.0.0 | 10.0.3 | Rest | High | HttpClient factory |
| **Microsoft.Extensions.Logging.Configuration** | 8.0.0 | 10.0.3 | Web | High | Logging configuration |
| **Microsoft.AspNetCore.Mvc.NewtonsoftJson** | 8.0.6 | 10.0.3 | Web | High | JSON serialization for MVC |
| **System.Runtime.Caching** | 8.0.0 | 10.0.3 | Core | Medium | Caching functionality |
| **Newtonsoft.Json** | 13.0.3 | 13.0.4 | Abstractions, Rest | Low | Patch update |

**Update Commands:**

```bash
# Abstractions
dotnet add Abstractions/Example.Api.Abstractions.csproj package Microsoft.Extensions.Configuration.Abstractions -v 10.0.3
dotnet add Abstractions/Example.Api.Abstractions.csproj package Microsoft.Extensions.DependencyInjection.Abstractions -v 10.0.3
dotnet add Abstractions/Example.Api.Abstractions.csproj package Microsoft.Extensions.Logging.Abstractions -v 10.0.3
dotnet add Abstractions/Example.Api.Abstractions.csproj package Newtonsoft.Json -v 13.0.4

# Rest
dotnet add Rest/Example.Api.Adapters.Rest.csproj package Microsoft.Extensions.Configuration.Binder -v 10.0.3
dotnet add Rest/Example.Api.Adapters.Rest.csproj package Microsoft.Extensions.Http -v 10.0.3
dotnet add Rest/Example.Api.Adapters.Rest.csproj package Newtonsoft.Json -v 13.0.4

# Core
dotnet add Core/Example.Api.Core.csproj package System.Runtime.Caching -v 10.0.3

# Web
dotnet add Web/Example.Api.Web.csproj package Microsoft.AspNetCore.Mvc.NewtonsoftJson -v 10.0.3
dotnet add Web/Example.Api.Web.csproj package Microsoft.Extensions.Logging.Configuration -v 10.0.3
```

### Packages to Remove

| Package | Current | Project | Reason | Action Required |
|---------|---------|---------|--------|-----------------|
| **System.ComponentModel.Annotations** | 5.0.0 | Rest | Included in .NET 10 framework | Remove PackageReference, no code changes |
| **System.Net.Http** | 4.3.4 | Rest | Included in .NET 10 framework | Remove PackageReference, no code changes |

**Remove Commands:**

```bash
# Rest
dotnet remove Rest/Example.Api.Adapters.Rest.csproj package System.ComponentModel.Annotations
dotnet remove Rest/Example.Api.Adapters.Rest.csproj package System.Net.Http
```

### Deprecated Packages Requiring Replacement

#### 1. Microsoft.AspNetCore.Mvc.Core (v2.2.5)

**Project:** Abstractions  
**Status:** ⚠️ Deprecated since .NET 5  
**Current Version:** 2.2.5 (ASP.NET Core 2.2)  
**Replacement:** Remove package (functionality in framework)

**Migration Steps:**

1. **Identify Usage:**
   ```bash
   # Search for imports
   grep -r "using Microsoft.AspNetCore.Mvc.Core" Abstractions/
   ```

2. **Replacement Strategy:**
   - Most types are now in `Microsoft.AspNetCore.Mvc` (framework reference)
   - For class libraries, add framework reference if needed:
     ```xml
     <ItemGroup>
       <FrameworkReference Include="Microsoft.AspNetCore.App" />
     </ItemGroup>
     ```

3. **Common Migrations:**
   - `Microsoft.AspNetCore.Mvc.Core.ControllerAttribute` → `Microsoft.AspNetCore.Mvc.ControllerAttribute`
   - `Microsoft.AspNetCore.Mvc.Core.ApiControllerAttribute` → `Microsoft.AspNetCore.Mvc.ApiControllerAttribute`

**Command:**
```bash
dotnet remove Abstractions/Example.Api.Abstractions.csproj package Microsoft.AspNetCore.Mvc.Core
```

#### 2. System.IdentityModel.Tokens.Jwt (v7.6.2)

**Projects:** Abstractions, Rest  
**Status:** ⚠️ Deprecated, migrate to LTS version  
**Current Version:** 7.6.2  
**Replacement:** 8.16.0 (LTS)

**Migration Steps:**

1. **Update Package:**
   ```bash
   dotnet add Abstractions/Example.Api.Abstractions.csproj package System.IdentityModel.Tokens.Jwt -v 8.16.0
   ```

2. **Code Changes Required:**

   **Option A: Keep JwtSecurityTokenHandler (Easier)**
   - Package v8.16.0 still supports `JwtSecurityTokenHandler`
   - Minimal code changes
   - **Recommended for initial migration**

   **Option B: Migrate to JsonWebTokenHandler (Modern)**
   - More significant code changes
   - Better performance and security
   - **Recommended for future refactoring**

3. **Breaking Changes in 8.x:**

   **Before (7.x):**
   ```csharp
   var handler = new JwtSecurityTokenHandler();
   handler.ValidateToken(token, parameters, out SecurityToken validatedToken);
   var jwt = validatedToken as JwtSecurityToken;
   ```

   **After (8.x - JwtSecurityTokenHandler):**
   ```csharp
   // Still works with minimal changes
   var handler = new JwtSecurityTokenHandler();
   var result = handler.ValidateToken(token, parameters, out SecurityToken validatedToken);
   var jwt = validatedToken as JwtSecurityToken;
   ```

   **After (8.x - JsonWebTokenHandler - Modern):**
   ```csharp
   using Microsoft.IdentityModel.JsonWebTokens;

   var handler = new JsonWebTokenHandler();
   var result = await handler.ValidateTokenAsync(token, parameters);
   if (result.IsValid)
   {
       var jwt = result.SecurityToken as JsonWebToken;
       var claims = result.ClaimsIdentity.Claims;
   }
   ```

4. **Files to Update:**
   - `Abstractions/Interfaces/Adapters/IJwtAdapter.cs`
   - `Abstractions/Interfaces/Services/IAuthenticationService.cs`
   - `Rest/Adapters/JwtAdapter.cs`

**Migration Documentation:**
- Official Guide: https://aka.ms/IdentityModel/LTS
- Breaking Changes: https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet/wiki/Breaking-changes-in-8.0.0

### Packages Already Compatible

✅ **No updates required** for these packages:

| Package | Version | Projects | Notes |
|---------|---------|----------|-------|
| **MongoDB.Driver** | 2.26.0 | Mongo | Fully compatible with .NET 10 |
| **MongoDB.Bson** | 2.26.0 | Abstractions, Mongo | Fully compatible |
| **Mapster** | 7.4.0 | Abstractions | Fully compatible |
| **Polly** | 8.4.0 | Rest | Fully compatible |
| **Scrutor** | 4.2.2 | Abstractions | Fully compatible |
| **Serilog** | 4.0.0 | Abstractions | Fully compatible |
| **Serilog.AspNetCore** | 8.0.1 | Web | Fully compatible |
| **Serilog.Extensions.Hosting** | 8.0.0 | Abstractions | Fully compatible |
| **Serilog.Sinks.Console** | 6.0.0 | Abstractions | Fully compatible |
| **Swashbuckle.AspNetCore** | 6.6.2 | Web | Fully compatible |
| **Swashbuckle.AspNetCore.Annotations** | 6.6.2 | Web | Fully compatible |
| **Swashbuckle.AspNetCore.Newtonsoft** | 6.6.2 | Web | Fully compatible |
| **Elyspio.Utils.Telemetry** | 1.0.0 | Abstractions | Custom package, verify compatibility |
| **Elyspio.Utils.Telemetry.MongoDB** | 1.0.0 | Abstractions | Custom package, verify compatibility |

### Aspire Packages to Add

**ServiceDefaults Project:**
```xml
<PackageReference Include="Microsoft.Extensions.Http.Resilience" Version="10.0.3" />
<PackageReference Include="Microsoft.Extensions.ServiceDiscovery" Version="10.0.3" />
<PackageReference Include="OpenTelemetry.Exporter.OpenTelemetryProtocol" Version="1.10.0" />
<PackageReference Include="OpenTelemetry.Extensions.Hosting" Version="1.10.0" />
<PackageReference Include="OpenTelemetry.Instrumentation.AspNetCore" Version="1.10.0" />
<PackageReference Include="OpenTelemetry.Instrumentation.Http" Version="1.10.0" />
<PackageReference Include="OpenTelemetry.Instrumentation.Runtime" Version="1.10.0" />
```

**AppHost Project:**
```xml
<PackageReference Include="Aspire.Hosting.AppHost" Version="10.0.3" />
<PackageReference Include="Aspire.Hosting.MongoDB" Version="10.0.3" />
<PackageReference Include="Aspire.Hosting.NodeJs" Version="10.0.3" />
```

**Web Project (additional):**
```xml
<ProjectReference Include="..\ServiceDefaults\ServiceDefaults.csproj" />
```

### Package Update Validation

After updating packages, verify with:

```bash
# Check for package vulnerabilities
dotnet list package --vulnerable

# Check for deprecated packages
dotnet list package --deprecated

# Check for outdated packages
dotnet list package --outdated

# Restore and verify
dotnet restore
dotnet build
```

### NuGet Source Mappings (Optional Improvement)

**Issue:** NuGet.0006 suggests adding source mappings for security

**Recommendation:** Create/update `NuGet.config`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <clear />
    <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
    <!-- Add private feeds here -->
  </packageSources>

  <packageSourceMapping>
    <!-- Microsoft packages -->
    <packageSource key="nuget.org">
      <package pattern="Microsoft.*" />
      <package pattern="System.*" />
      <package pattern="Aspire.*" />
      <package pattern="OpenTelemetry.*" />
      <!-- Third-party packages -->
      <package pattern="MongoDB.*" />
      <package pattern="Newtonsoft.*" />
      <package pattern="Mapster" />
      <package pattern="Polly" />
      <package pattern="Scrutor" />
      <package pattern="Serilog.*" />
      <package pattern="Swashbuckle.*" />
    </packageSource>
    <!-- Map custom packages to private feed -->
    <!-- <packageSource key="private-feed">
      <package pattern="Elyspio.*" />
    </packageSource> -->
  </packageSourceMapping>
</configuration>
```

**Benefits:**
- Improved supply chain security
- Faster package resolution
- Deterministic package sources

**Priority:** Optional (informational issue only)

---

## Breaking Changes Catalog

### Overview

**Total Breaking Changes:** 12 binary incompatible + 146 behavioral changes  
**Impact Assessment:** Low to Medium  
**Primary Areas:** IdentityModel (JWT), HttpClient, Dependency Injection

---

### Binary Breaking Changes (12)

Binary breaking changes require code modifications to compile successfully.

#### 1. JwtSecurityToken Type (2 occurrences)

**Rule ID:** Api.0001  
**Severity:** Mandatory  
**Impact:** Medium

**Affected Files:**
- `Abstractions/Interfaces/Adapters/IJwtAdapter.cs`, line 6
- `Abstractions/Interfaces/Services/IAuthenticationService.cs`, line 6

**Current Code:**
```csharp
using System.IdentityModel.Tokens.Jwt;

public interface IJwtAdapter
{
    bool ValidateJwt(string? token, out JwtSecurityToken? validatedToken);
}
```

**Issue:**  
The `JwtSecurityToken` type has breaking changes in System.IdentityModel.Tokens.Jwt 8.x

**Solution Option 1 (Minimal Change):**
```csharp
using System.IdentityModel.Tokens.Jwt;

public interface IJwtAdapter
{
    // Keep same signature, update implementation only
    bool ValidateJwt(string? token, out JwtSecurityToken? validatedToken);
}
```
Update package to 8.16.0, implementation changes minimal.

**Solution Option 2 (Modern Approach):**
```csharp
using Microsoft.IdentityModel.JsonWebTokens;

public interface IJwtAdapter
{
    bool ValidateJwt(string? token, out JsonWebToken? validatedToken);
}
```
Requires updating all implementations and callers.

**Recommendation:** Use Option 1 for initial migration.

---

#### 2. JwtSecurityTokenHandler Type (2 occurrences)

**Rule ID:** Api.0001  
**Severity:** Mandatory  
**Impact:** Medium

**Affected Files:**
- `Rest/Adapters/JwtAdapter.cs`, line 35

**Current Code:**
```csharp
using System.IdentityModel.Tokens.Jwt;

public class JwtAdapter : IJwtAdapter
{
    public bool ValidateJwt(string? token, out JwtSecurityToken? validatedToken)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        // ...
    }
}
```

**Issue:**  
`JwtSecurityTokenHandler` constructor and methods have breaking changes.

**Solution:**
```csharp
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

public class JwtAdapter : IJwtAdapter
{
    public bool ValidateJwt(string? token, out JwtSecurityToken? validatedToken)
    {
        var tokenHandler = new JwtSecurityTokenHandler();

        try
        {
            var principal = tokenHandler.ValidateToken(token, 
                new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = _publicKey,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, 
                out var securityToken);

            validatedToken = securityToken as JwtSecurityToken;
            return validatedToken != null;
        }
        catch
        {
            validatedToken = null;
            return false;
        }
    }
}
```

**Changes:**
- `ValidateToken` method signature remains compatible in 8.x
- Return value handling might need adjustment
- Error handling patterns might differ

---

#### 3. JwtSecurityTokenHandler.ValidateToken (2 occurrences)

**Rule ID:** Api.0001  
**Severity:** Mandatory  
**Impact:** Medium

**Affected Files:**
- `Rest/Adapters/JwtAdapter.cs`, line 39

**Current Code:**
```csharp
tokenHandler.ValidateToken(token, validationParameters, out var securityToken);
```

**Issue:**  
Method signature changes in v8.x

**Solution:**
```csharp
// v8.x compatible approach
try
{
    var claimsPrincipal = tokenHandler.ValidateToken(
        token, 
        validationParameters, 
        out SecurityToken validatedToken);

    // Use validatedToken
    return true;
}
catch (SecurityTokenException)
{
    return false;
}
```

**Notes:**
- Exception handling is now more granular
- `SecurityTokenException` and subclasses for different failure modes
- Consider async version: `ValidateTokenAsync()` (optional)

---

#### 4. ServiceCollectionExtensions (Scrutor) (1 occurrence)

**Rule ID:** Api.0001  
**Severity:** Mandatory  
**Impact:** Low

**Affected Files:**
- `Rest/Injections/RestAdapterModule.cs`, line 18

**Current Code:**
```csharp
services.Scan(s => s.FromAssemblyOf<RestAdapterModule>()
    .AddClasses(c => c.InNamespaceOf<JwtAdapter>())
    .AsImplementedInterfaces()
    .WithSingletonLifetime()
);
```

**Issue:**  
Scrutor's `Scan` extension method may have assembly scanning changes.

**Solution:**
Scrutor 4.2.2 is compatible with .NET 10. Likely no changes needed, but verify:

```csharp
// Test after framework update
services.Scan(s => s
    .FromAssemblyOf<RestAdapterModule>()
    .AddClasses(c => c.InNamespaceOf<JwtAdapter>())
    .AsImplementedInterfaces()
    .WithSingletonLifetime()
);
```

**Validation:**
- Build project
- Test DI container resolution
- Verify singleton lifetimes

**If Issues:**
Update Scrutor to latest version or replace with manual registration.

---

### Behavioral Changes (146)

Behavioral changes don't break compilation but may cause runtime differences.

#### 5. ActivitySource.StartActivity (1 occurrence)

**Rule ID:** Api.0003  
**Severity:** Potential  
**Impact:** Low

**Affected Files:**
- `Abstractions/Common/Technical/Tracing/Base/TracingContext.cs`, line 23

**Current Code:**
```csharp
var activity = source.StartActivity($"{@class}.{method}");
```

**Change:**  
.NET 10 has refined activity creation and propagation behavior.

**Action:**
- No code changes required
- Test tracing/logging to verify activity creation
- Check distributed tracing propagation if using OpenTelemetry

**Testing:**
```csharp
// Verify activity is created
var activity = source.StartActivity($"{@class}.{method}");
Assert.IsNotNull(activity);
Assert.AreEqual(ActivityKind.Internal, activity.Kind); // default
```

---

#### 6-149. HttpContent Methods (144 occurrences)

**Rule ID:** Api.0003  
**Severity:** Potential  
**Impact:** Low-Medium

**Affected Files:**
- `Rest/Connected Services/AuthenticationApi/AuthenticationApi.cs` (multiple lines)

**Primary APIs:**
- `HttpContent.ReadAsStreamAsync()`
- `HttpContent.ReadAsStringAsync()`
- `HttpContent` property access

**Changes in .NET 10:**

1. **Cancellation Token Support:**
   ```csharp
   // Old (still works):
   var stream = await response.Content.ReadAsStreamAsync();

   // New (recommended):
   var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
   ```

2. **Improved Async Behavior:**
   - Better buffering strategies
   - More efficient memory usage
   - Improved cancellation handling

3. **Null Handling:**
   ```csharp
   // Ensure null checks:
   if (response?.Content == null)
       throw new InvalidOperationException("Response content is null");
   ```

**Recommendation:**

**For Auto-Generated Code:**
The file `AuthenticationApi.cs` appears to be auto-generated (OpenAPI/NSwag/Swagger client).

**Option 1: Regenerate Client (Recommended)**
```bash
# If using NSwag
nswag run nswag.json

# If using OpenAPI generator
dotnet tool install --global Microsoft.dotnet-openapi
dotnet openapi refresh --source-file swagger.json
```

**Option 2: Manual Review**
- Review all 144 occurrences
- Add cancellation token support where applicable
- Test HTTP calls thoroughly

**Option 3: Accept As-Is**
- Code will still work (backward compatible)
- Performance might be slightly suboptimal
- Lack cancellation token propagation

**Testing Checklist:**
- [ ] HTTP GET requests
- [ ] HTTP POST with JSON body
- [ ] HTTP error responses (4xx, 5xx)
- [ ] Network timeout scenarios
- [ ] Cancellation token propagation

---

#### 150-151. Uri Constructor (2 occurrences)

**Rule ID:** Api.0003  
**Severity:** Potential  
**Impact:** Low

**Affected Files:**
- `Rest/Injections/RestAdapterModule.cs`, line 16

**Current Code:**
```csharp
client.BaseAddress = new Uri(conf.Authentication);
```

**Change:**  
.NET 10 has stricter URI validation and parsing.

**Potential Issues:**
- Invalid URI formats may throw exceptions
- Relative URIs behavior might differ
- IPv6 address handling changes

**Solution:**
```csharp
// Add validation:
if (string.IsNullOrWhiteSpace(conf.Authentication))
    throw new ArgumentException("Authentication URL is not configured", nameof(conf.Authentication));

if (!Uri.TryCreate(conf.Authentication, UriKind.Absolute, out var baseUri))
    throw new ArgumentException($"Invalid authentication URL: {conf.Authentication}", nameof(conf.Authentication));

client.BaseAddress = baseUri;
```

**Testing:**
- Verify configuration has valid URLs
- Test with various URL formats:
  - `http://localhost:5000`
  - `https://api.example.com`
  - `https://api.example.com/v1/` (trailing slash)

---

### Breaking Change Summary by Project

| Project | Binary Breaking | Behavioral | Priority | Estimated Effort |
|---------|----------------|------------|----------|------------------|
| **Abstractions** | 2 | 1 | High | 30 min |
| **Mongo** | 0 | 0 | Low | 0 min |
| **Rest** | 8 | 146 | High | 60 min |
| **Core** | 0 | 0 | Low | 0 min |
| **Web** | 0 | 0 | Low | 0 min |

---

### Migration Checklist

**Binary Breaking Changes:**
- [ ] Update System.IdentityModel.Tokens.Jwt to 8.16.0
- [ ] Fix JWT interface signatures (Abstractions)
- [ ] Fix JWT implementation (Rest/JwtAdapter.cs)
- [ ] Test JWT validation flows
- [ ] Verify Scrutor DI scanning (Rest)
- [ ] Build all projects successfully

**Behavioral Changes:**
- [ ] Test activity/tracing functionality (Abstractions)
- [ ] Review HTTP client code (Rest/AuthenticationApi.cs)
- [ ] Consider regenerating API client
- [ ] Test all HTTP requests
- [ ] Validate URI configuration
- [ ] Run integration tests

**Documentation:**
- [ ] Document JWT migration approach
- [ ] Note any API client regeneration
- [ ] Record any runtime behavior changes observed
- [ ] Update README if user-facing changes

---

### Reference Links

- **Breaking Changes in .NET:** https://go.microsoft.com/fwlink/?linkid=2262679
- **IdentityModel Migration:** https://aka.ms/IdentityModel/LTS
- **IdentityModel 8.0 Breaking Changes:** https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet/wiki/Breaking-changes-in-8.0.0
- **.NET 10 Breaking Changes:** https://learn.microsoft.com/en-us/dotnet/core/compatibility/10.0

---

## Testing & Validation Strategy

### Overview

Comprehensive testing ensures the .NET 10 upgrade doesn't introduce regressions while Aspire integration works correctly.

### Testing Phases

#### Phase 1: Compilation Validation

**Goal:** Ensure all projects build successfully.

**Steps:**
```bash
# Clean solution
dotnet clean

# Restore packages
dotnet restore

# Build each project in dependency order
dotnet build Abstractions/Example.Api.Abstractions.csproj --configuration Release
dotnet build Db/Example.Api.Adapters.Mongo.csproj --configuration Release
dotnet build Rest/Example.Api.Adapters.Rest.csproj --configuration Release
dotnet build Core/Example.Api.Core.csproj --configuration Release
dotnet build Web/Example.Api.Web.csproj --configuration Release
dotnet build ServiceDefaults/ServiceDefaults.csproj --configuration Release
dotnet build AppHost/AppHost.csproj --configuration Release

# Build entire solution
dotnet build --configuration Release
```

**Success Criteria:**
- ✅ 0 compilation errors
- ✅ 0 warnings (or only expected warnings)
- ✅ All projects target net10.0

---

#### Phase 2: Unit Tests

**Goal:** Verify existing tests pass.

**Steps:**
```bash
# Discover test projects
dotnet test --list-tests

# Run all tests
dotnet test --configuration Release --logger "console;verbosity=detailed"

# Run tests with coverage (optional)
dotnet test --collect:"XPlat Code Coverage"
```

**Focus Areas:**
- JWT validation logic
- MongoDB data access
- HTTP client functionality
- Business logic in Core
- API endpoints

**Success Criteria:**
- ✅ All existing tests pass
- ✅ No new test failures introduced
- ✅ Code coverage maintained or improved

---

#### Phase 3: Integration Testing

**Goal:** Verify components work together correctly.

##### A. JWT Authentication Flow

**Test Cases:**
```csharp
// Test valid token validation
[Test]
public void ValidateJwt_ValidToken_ReturnsTrue()
{
    var token = GenerateValidToken();
    var result = jwtAdapter.ValidateJwt(token, out var validatedToken);

    Assert.IsTrue(result);
    Assert.IsNotNull(validatedToken);
    Assert.AreEqual(expectedClaims, validatedToken.Claims);
}

// Test expired token
[Test]
public void ValidateJwt_ExpiredToken_ReturnsFalse()
{
    var token = GenerateExpiredToken();
    var result = jwtAdapter.ValidateJwt(token, out var validatedToken);

    Assert.IsFalse(result);
    Assert.IsNull(validatedToken);
}

// Test invalid signature
[Test]
public void ValidateJwt_InvalidSignature_ReturnsFalse()
{
    var token = GenerateTokenWithInvalidSignature();
    var result = jwtAdapter.ValidateJwt(token, out var validatedToken);

    Assert.IsFalse(result);
}
```

##### B. MongoDB Connectivity

**Test Cases:**
```csharp
// Test connection
[Test]
public async Task MongoDB_Connection_Succeeds()
{
    var client = serviceProvider.GetRequiredService<IMongoClient>();
    var database = client.GetDatabase("example-db");
    var canConnect = await database.RunCommandAsync<BsonDocument>(
        new BsonDocument("ping", 1));

    Assert.IsNotNull(canConnect);
}

// Test CRUD operations
[Test]
public async Task MongoDB_CrudOperations_Work()
{
    // Insert
    var id = await repository.InsertAsync(testEntity);
    Assert.IsNotNull(id);

    // Read
    var retrieved = await repository.GetByIdAsync(id);
    Assert.AreEqual(testEntity.Name, retrieved.Name);

    // Update
    retrieved.Name = "Updated";
    await repository.UpdateAsync(retrieved);

    // Delete
    await repository.DeleteAsync(id);
}
```

##### C. HTTP Client (Authentication API)

**Test Cases:**
```csharp
// Test API calls
[Test]
public async Task AuthenticationApi_Login_Succeeds()
{
    var client = new AuthenticationApiClient(httpClient);
    var result = await client.LoginAsync(credentials);

    Assert.IsNotNull(result);
    Assert.IsNotNull(result.Token);
}

// Test error handling
[Test]
public async Task AuthenticationApi_InvalidCredentials_ThrowsException()
{
    var client = new AuthenticationApiClient(httpClient);

    Assert.ThrowsAsync<ApiException>(
        async () => await client.LoginAsync(invalidCredentials));
}
```

##### D. Dependency Injection (Scrutor)

**Test Cases:**
```csharp
// Test services are registered
[Test]
public void DI_AllServicesRegistered()
{
    var services = new ServiceCollection();
    services.AddRestAdapterModule(configuration);
    var provider = services.BuildServiceProvider();

    // Verify all expected services can be resolved
    Assert.IsNotNull(provider.GetService<IJwtAdapter>());
    Assert.IsNotNull(provider.GetService<IAuthenticationService>());
    // ... etc
}
```

**Success Criteria:**
- ✅ JWT validation works correctly
- ✅ MongoDB CRUD operations succeed
- ✅ HTTP client calls succeed
- ✅ All DI services resolve correctly

---

#### Phase 4: Aspire Integration Testing

**Goal:** Verify Aspire orchestration works correctly.

##### A. AppHost Startup

**Steps:**
```bash
# Start AppHost
dotnet run --project AppHost/AppHost.csproj
```

**Verify:**
- [ ] AppHost starts without errors
- [ ] Aspire dashboard opens (`http://localhost:15888` or similar)
- [ ] All resources shown in dashboard:
  - MongoDB (mongodb)
  - API (api)
  - Frontend (frontend)

##### B. MongoDB Resource

**Verify:**
- [ ] MongoDB container starts
- [ ] MongoDB is healthy in dashboard
- [ ] Connection string is available
- [ ] API can connect to MongoDB
- [ ] Data persists across restarts (volume mounted)

**Test:**
```bash
# Check MongoDB container
docker ps | grep mongo

# Test connection from API
# Make API call that hits database
curl http://localhost:5000/api/test-endpoint
```

##### C. NPM Frontend Resource

**Prerequisites:**
- Ensure `../front/package.json` exists
- Ensure `npm install` runs successfully
- Ensure start script is defined

**Verify:**
- [ ] NPM project builds/starts
- [ ] Frontend is accessible (e.g., `http://localhost:3000`)
- [ ] Frontend can call API
- [ ] Environment variables are set correctly (`REACT_APP_API_URL`)

**Test:**
```bash
# Check frontend is running
curl http://localhost:3000

# Check API call from frontend
# Use browser dev tools network tab
```

##### D. Service Discovery & Environment Variables

**Verify:**
```bash
# Check environment variables in API container
dotnet run --project Web/Example.Api.Web.csproj

# Look for:
# ConnectionStrings__mongodb=mongodb://...
# REACT_APP_API_URL=http://...
```

**Test:**
- [ ] API can resolve MongoDB connection string
- [ ] Frontend can call API using injected URL
- [ ] Service-to-service communication works

##### E. OpenTelemetry & Observability

**Verify:**
- [ ] Metrics are collected (dashboard shows metrics)
- [ ] Traces are collected (dashboard shows traces)
- [ ] Logs are collected (dashboard shows logs)
- [ ] Health checks work (`/health` endpoint)

**Test:**
```bash
# Health check
curl http://localhost:5000/health

# Alive check
curl http://localhost:5000/alive

# Check Aspire dashboard
# Navigate to Traces, Metrics, Logs tabs
```

**Success Criteria:**
- ✅ All resources start successfully
- ✅ MongoDB connection works
- ✅ Frontend can call API
- ✅ Service discovery works
- ✅ Telemetry data is visible in dashboard

---

#### Phase 5: End-to-End Testing

**Goal:** Verify complete application workflows.

**Test Scenarios:**

1. **User Authentication Flow**
   - Start application via AppHost
   - Open frontend in browser
   - Log in with credentials
   - Verify JWT token received
   - Verify authenticated API calls work

2. **Data Persistence Flow**
   - Create data via frontend
   - Verify data saved to MongoDB
   - Refresh page
   - Verify data persists
   - Stop/restart AppHost
   - Verify data still persists (volume)

3. **Error Handling Flow**
   - Stop MongoDB container
   - Verify API returns appropriate error
   - Verify health check shows unhealthy
   - Restart MongoDB
   - Verify API recovers

**Success Criteria:**
- ✅ All user workflows complete successfully
- ✅ Data persists correctly
- ✅ Error handling works as expected
- ✅ Application recovers from failures

---

#### Phase 6: Performance Testing (Optional)

**Goal:** Ensure performance hasn't regressed.

**Metrics to Measure:**
- API response times
- MongoDB query times
- JWT validation times
- Memory usage
- CPU usage

**Tools:**
```bash
# Load testing with Apache Bench
ab -n 1000 -c 10 http://localhost:5000/api/endpoint

# Or use k6
k6 run load-test.js
```

**Success Criteria:**
- ✅ Response times within acceptable range
- ✅ No memory leaks
- ✅ Performance similar to or better than .NET 9

---

### Testing Checklist

**Pre-Upgrade:**
- [ ] Document current test results
- [ ] Record current performance metrics
- [ ] Take backup/snapshot of development environment

**During Migration:**
- [ ] Test each project after framework update
- [ ] Test after each package update
- [ ] Test after breaking change fixes

**Post-Migration:**
- [ ] Run full test suite
- [ ] Verify all tests pass
- [ ] Compare with pre-upgrade results

**Aspire Integration:**
- [ ] Test AppHost startup
- [ ] Test MongoDB resource
- [ ] Test NPM frontend resource
- [ ] Test service discovery
- [ ] Test telemetry collection
- [ ] Test end-to-end workflows

**Final Validation:**
- [ ] Code review changes
- [ ] Update documentation
- [ ] Commit to upgrade branch
- [ ] Create pull request
- [ ] Get team review

---

### Test Automation

**Recommended CI/CD Pipeline:**

```yaml
name: .NET 10 Upgrade CI

on:
  push:
    branches: [ upgrade-to-NET10 ]
  pull_request:
    branches: [ upgrade-to-NET10 ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup .NET 10
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: '10.0.x'

    - name: Restore dependencies
      run: dotnet restore

    - name: Build
      run: dotnet build --no-restore --configuration Release

    - name: Test
      run: dotnet test --no-build --configuration Release --verbosity normal

    - name: Test Aspire AppHost
      run: |
        cd AppHost
        dotnet run --no-build --configuration Release &
        sleep 30  # Wait for startup
        curl -f http://localhost:15888 || exit 1
```

---

### Troubleshooting Common Issues

**Issue: JWT validation fails**
- Check System.IdentityModel.Tokens.Jwt version (must be 8.16.0)
- Review token validation parameters
- Check signature key configuration
- Verify token format

**Issue: MongoDB connection fails**
- Check Aspire MongoDB resource configuration
- Verify connection string injection
- Check MongoDB container is running: `docker ps`
- Check AppHost logs

**Issue: NPM frontend doesn't start**
- Verify `../front/package.json` exists
- Run `npm install` manually
- Check start script is defined
- Verify Node.js version compatibility

**Issue: HttpClient calls fail**
- Check if API client was regenerated
- Verify cancellation tokens
- Check base URL configuration
- Review HttpClient factory registration

**Issue: Aspire dashboard doesn't open**
- Check AppHost starts successfully
- Look for dashboard URL in console output
- Check port 15888 (or similar) is not blocked
- Review AppHost logs for errors

---

## Risk Management

### Risk Assessment Matrix

| Risk | Likelihood | Impact | Severity | Mitigation | Owner |
|------|-----------|--------|----------|------------|-------|
| JWT validation breaks | Medium | High | **High** | Test thoroughly, have rollback plan | Backend Team |
| MongoDB connection issues | Low | High | **Medium** | Test Aspire config, verify connection strings | DevOps/Backend |
| NPM frontend integration fails | Medium | Medium | **Medium** | Verify package.json, test manually first | Frontend Team |
| HTTP client behavioral changes | Medium | Medium | **Medium** | Consider regenerating API client, test all endpoints | Backend Team |
| Deprecated package removal breaks code | Low | Medium | **Low** | Review usages before removal, test builds | Backend Team |
| Performance regression | Low | Medium | **Low** | Benchmark before/after, monitor in production | All Teams |
| Aspire learning curve | Medium | Low | **Low** | Follow official docs, use templates | All Teams |
| Breaking changes in dependencies | Low | High | **Medium** | Review release notes, test integration | Backend Team |

---

### High-Risk Areas

#### 1. JWT Authentication (High Severity)

**Risk:** System.IdentityModel.Tokens.Jwt 7.x → 8.x has breaking changes that could break authentication.

**Impact:**
- Users unable to log in
- API rejects valid tokens
- Security vulnerabilities if incorrectly implemented

**Mitigation Strategy:**
1. **Before Migration:**
   - Document current JWT validation logic
   - Save sample valid tokens for testing
   - Review IdentityModel 8.0 migration guide

2. **During Migration:**
   - Update package first
   - Fix compilation errors
   - Keep existing algorithm/signature unchanged

3. **After Migration:**
   - Test with real tokens
   - Verify all claims are parsed correctly
   - Test token expiration handling
   - Test invalid token rejection

4. **Rollback Plan:**
   - Keep old implementation in comments
   - Document exact changes made
   - Can revert to 7.6.2 if critical issues

**Testing Checklist:**
- [ ] Valid token validates successfully
- [ ] Expired token is rejected
- [ ] Invalid signature is rejected
- [ ] Claims are parsed correctly
- [ ] Token expiration works
- [ ] ClockSkew handled correctly

---

#### 2. HTTP Client Behavioral Changes (Medium Severity)

**Risk:** 146 behavioral changes in HttpContent APIs could cause subtle runtime issues.

**Impact:**
- API calls may fail or timeout
- Serialization/deserialization issues
- Unexpected exceptions

**Mitigation Strategy:**
1. **Before Migration:**
   - Document all external API dependencies
   - Create integration tests for each endpoint
   - Consider if API client is auto-generated

2. **During Migration:**
   - Review auto-generated client (AuthenticationApi.cs)
   - Consider regenerating with latest tools
   - Add cancellation token support if feasible

3. **After Migration:**
   - Test all API endpoints
   - Monitor for timeout/cancellation issues
   - Check serialization of complex types

4. **Rollback Plan:**
   - Keep old generated client in backup
   - Can regenerate from same OpenAPI spec

**Testing Checklist:**
- [ ] All HTTP GET requests work
- [ ] All HTTP POST/PUT/DELETE requests work
- [ ] Error responses (4xx, 5xx) handled correctly
- [ ] Timeouts work as expected
- [ ] Large payloads don't cause issues

---

#### 3. MongoDB Connection (Medium Severity)

**Risk:** Aspire MongoDB resource configuration could fail, breaking database access.

**Impact:**
- Application can't read/write data
- Data persistence broken
- Development environment unusable

**Mitigation Strategy:**
1. **Before Migration:**
   - Document current connection string format
   - Test MongoDB container locally
   - Verify Docker is working

2. **During Migration:**
   - Follow Aspire MongoDB template exactly
   - Use data volume for persistence
   - Test connection before adding to AppHost

3. **After Migration:**
   - Test CRUD operations
   - Verify data persists across restarts
   - Check connection pooling works

4. **Rollback Plan:**
   - Can run MongoDB container manually
   - Can use old connection string approach
   - Aspire is optional for development

**Testing Checklist:**
- [ ] MongoDB container starts
- [ ] Connection string is injected
- [ ] CRUD operations work
- [ ] Data persists across restarts
- [ ] Connection pooling works

---

### Medium-Risk Areas

#### 4. NPM Frontend Integration (Medium Severity)

**Risk:** Aspire NPM resource might not start frontend correctly.

**Impact:**
- Frontend not accessible
- Development workflow broken
- Cannot test full stack

**Mitigation Strategy:**
1. **Before Migration:**
   - Verify `../front/package.json` is valid
   - Test `npm install` and `npm start` manually
   - Ensure Node.js version is compatible

2. **During Migration:**
   - Use Aspire NodeJs template
   - Verify path `../../front` is correct relative to AppHost
   - Test frontend starts independently first

3. **After Migration:**
   - Verify frontend accessible in browser
   - Test API calls from frontend
   - Verify environment variables set correctly

4. **Fallback:**
   - Can run frontend manually: `cd ../front && npm start`
   - Aspire frontend integration is nice-to-have

**Testing Checklist:**
- [ ] Frontend starts via Aspire
- [ ] Frontend accessible at expected port
- [ ] API URL environment variable set
- [ ] Frontend can call API
- [ ] Hot reload works (if applicable)

---

#### 5. Deprecated Package Removal (Low-Medium Severity)

**Risk:** Removing Microsoft.AspNetCore.Mvc.Core could break code if heavily used.

**Impact:**
- Compilation errors
- Missing types/methods
- Refactoring required

**Mitigation Strategy:**
1. **Before Migration:**
   - Search for all usages: `grep -r "Microsoft.AspNetCore.Mvc.Core"`
   - Identify which types are used
   - Check if types are in framework

2. **During Migration:**
   - Remove package only after framework update
   - Add FrameworkReference if needed
   - Update using statements

3. **After Migration:**
   - Build and test
   - Verify all MVC functionality works

4. **Rollback Plan:**
   - Can keep package if critical issues
   - Mark as technical debt to remove later

---

### Low-Risk Areas

#### 6. Other Package Updates (Low Severity)

**Risk:** Updating Microsoft.Extensions.* packages could introduce minor issues.

**Impact:**
- Minor API changes
- Configuration changes
- Logging behavior changes

**Mitigation:**
- Standard semantic versioning (8.x → 10.x)
- Microsoft maintains backward compatibility
- Test after updating

---

#### 7. Aspire Learning Curve (Low Severity)

**Risk:** Team unfamiliar with Aspire concepts.

**Impact:**
- Slower development
- Incorrect configurations
- Underutilized features

**Mitigation:**
1. **Training:**
   - Review official Aspire docs
   - Follow tutorials/samples
   - Experiment with templates

2. **Documentation:**
   - Document Aspire setup in README
   - Add comments to AppHost/Program.cs
   - Create team knowledge base

3. **Support:**
   - Official docs: https://learn.microsoft.com/dotnet/aspire
   - Community support: GitHub issues, Discord
   - Microsoft support if needed

---

### Rollback Strategy

#### Complete Rollback

**Scenario:** Critical issues, cannot proceed with upgrade.

**Steps:**
```bash
# 1. Switch back to master branch
git checkout master

# 2. Verify application works
dotnet build
dotnet test
dotnet run --project Web/Example.Api.Web.csproj

# 3. Delete upgrade branch (if desired)
git branch -D upgrade-to-NET10
```

**Impact:**
- All .NET 10 changes reverted
- Back to .NET 9
- No Aspire integration
- No data loss (MongoDB data in containers can be preserved)

---

#### Partial Rollback

**Scenario:** Some parts work, others need more time.

**Option 1: Rollback Aspire Only**
- Keep .NET 10 upgrade
- Remove ServiceDefaults and AppHost projects
- Run services manually (MongoDB, frontend)

**Option 2: Rollback JWT Changes Only**
- Revert to System.IdentityModel.Tokens.Jwt 7.6.2
- Keep other .NET 10 changes
- Fix JWT issues later

---

### Contingency Plans

#### If JWT Validation Fails

**Immediate:**
1. Check logs for specific errors
2. Verify token format hasn't changed
3. Test with known valid token

**Short-term:**
1. Revert to package v7.6.2
2. Continue with .NET 10 on other areas
3. Schedule JWT fix separately

**Long-term:**
1. Refactor to JsonWebTokenHandler (modern approach)
2. Add comprehensive JWT tests
3. Consider token versioning strategy

---

#### If MongoDB Connection Fails

**Immediate:**
1. Check AppHost logs
2. Verify MongoDB container running: `docker ps`
3. Test connection manually

**Short-term:**
1. Run MongoDB container manually
2. Use traditional connection string
3. Skip Aspire MongoDB integration initially

**Long-term:**
1. Review Aspire MongoDB configuration
2. Contact Aspire support/community
3. Consider alternative (Docker Compose)

---

#### If Build Fails

**Immediate:**
1. Read error messages carefully
2. Check which project fails
3. Isolate the issue

**Short-term:**
1. Revert last change
2. Build incrementally (one project at a time)
3. Use `dotnet build --verbosity detailed`

**Long-term:**
1. Review all package versions
2. Check for incompatibilities
3. Update to compatible versions

---

### Risk Monitoring

**During Migration:**
- [ ] Build after each major change
- [ ] Test after each package update
- [ ] Review logs for warnings
- [ ] Check for runtime exceptions

**After Migration:**
- [ ] Monitor application logs
- [ ] Check error rates
- [ ] Monitor performance metrics
- [ ] Review Aspire dashboard

**Production Deployment:**
- [ ] Blue/green deployment
- [ ] Gradual rollout (canary)
- [ ] Monitor closely for first 24 hours
- [ ] Have rollback plan ready

---

### Communication Plan

**Stakeholders:**
- Development team
- QA team
- DevOps team
- Product owner
- Users (if affecting production)

**Updates:**
- Start of migration: "Beginning .NET 10 upgrade"
- Mid-migration: "50% complete, no blockers"
- End of migration: "Upgrade complete, testing in progress"
- Post-migration: "Deployed to [environment], monitoring"

**Escalation:**
- Critical issues: Immediately escalate to tech lead
- Blocking issues: Escalate within 4 hours
- Minor issues: Document and address next sprint

---

## Complexity & Effort Assessment

### Overall Complexity: **Low**

Despite 183 issues identified, the upgrade is straightforward due to:
- ✅ Already on modern .NET (9.0 → 10.0 single version jump)
- ✅ Small solution (5 projects, 4,408 LOC)
- ✅ Simple dependency structure (2-level depth)
- ✅ High package compatibility (82%)
- ✅ All projects SDK-style (no conversion needed)
- ✅ No security vulnerabilities

---

### Complexity Breakdown by Project

| Project | Complexity | Reason | Effort (hours) |
|---------|-----------|--------|----------------|
| **Abstractions** | **Low-Medium** | JWT package deprecation, 2 binary breaking changes | 0.75 |
| **Mongo** | **Very Low** | No issues, just framework update | 0.15 |
| **Rest** | **Medium** | 146 behavioral changes in HTTP client, JWT fixes | 1.0 |
| **Core** | **Very Low** | Minimal changes, one package update | 0.15 |
| **Web** | **Low** | Package updates + Aspire integration | 0.5 |
| **ServiceDefaults** | **Low** | New project from template | 0.35 |
| **AppHost** | **Low-Medium** | New project, configure 3 resources | 0.5 |
| **Testing** | **Medium** | Comprehensive testing across all areas | 1.0 |
| **Documentation** | **Low** | Update README, commit changes | 0.25 |
| **Total** | **Low** | Well-structured, manageable scope | **4.65 hours** |

---

### Complexity Factors

#### Reducing Complexity ✅

1. **Modern Starting Point**
   - .NET 9.0 is already modern
   - One version jump vs. multi-version
   - No framework conversion needed

2. **Small Codebase**
   - 4,408 LOC across 5 projects
   - Easy to review and test
   - Fast build times

3. **Clean Architecture**
   - Clear separation of concerns
   - Simple dependency graph
   - Easy to reason about

4. **Good Package Health**
   - Most packages already compatible
   - Well-maintained dependencies (Serilog, MongoDB, Swashbuckle)
   - No obscure or abandoned packages

#### Increasing Complexity ⚠️

1. **JWT Package Deprecation**
   - Breaking changes in IdentityModel 7.x → 8.x
   - Requires understanding security implications
   - Must test authentication thoroughly

2. **High Behavioral Change Count**
   - 146 changes in Rest project (mostly HttpClient)
   - Requires review, though likely low impact
   - Auto-generated code complicates changes

3. **Aspire Introduction**
   - New technology for team
   - Learning curve for configuration
   - Additional moving parts (containers, orchestration)

4. **NPM Frontend Integration**
   - Cross-platform concern (Node.js + .NET)
   - Path dependencies (../front)
   - Potential environment differences

---

### Effort Estimation

#### Detailed Task Breakdown

**Phase 1: Preparation (30 min)**
- Install .NET 10 SDK: 10 min
- Create upgrade branch: 5 min
- Review plan document: 15 min

**Phase 2: Framework Updates (45 min)**
- Update Abstractions: 5 min
- Update Mongo: 5 min
- Update Rest: 5 min
- Update Core: 5 min
- Update Web: 5 min
- Build all projects: 10 min
- Fix initial build errors: 10 min

**Phase 3: Package Updates (30 min)**
- Update Microsoft.Extensions.* packages: 10 min
- Update other packages: 5 min
- Remove deprecated packages: 5 min
- Remove framework-included packages: 5 min
- Build and verify: 5 min

**Phase 4: Breaking Changes (60 min)**
- Fix JWT types in Abstractions (2): 15 min
- Fix JWT implementation in Rest (5): 30 min
- Test JWT validation: 10 min
- Review HTTP client changes: 5 min

**Phase 5: Aspire Integration (60 min)**
- Create ServiceDefaults project: 15 min
- Implement service defaults extensions: 15 min
- Create AppHost project: 10 min
- Configure MongoDB resource: 10 min
- Configure NPM frontend resource: 10 min

**Phase 6: Web Project Integration (20 min)**
- Add ServiceDefaults reference: 5 min
- Update Program.cs: 10 min
- Test startup: 5 min

**Phase 7: Testing (60 min)**
- Build validation: 5 min
- Unit tests: 10 min
- JWT integration tests: 15 min
- MongoDB integration tests: 10 min
- Aspire orchestration tests: 15 min
- End-to-end smoke tests: 5 min

**Phase 8: Documentation (15 min)**
- Update README: 10 min
- Commit changes: 5 min

**Total: ~4.5-5 hours** (single developer, focused work)

---

### Team Effort

If distributed across team:

**Backend Developer 1: Abstractions + Rest (2 hours)**
- Framework updates
- Package updates
- JWT fixes
- HTTP client review

**Backend Developer 2: Core + Web (1.5 hours)**
- Framework updates
- Package updates
- Web project Aspire integration

**DevOps Engineer: Aspire Setup (1.5 hours)**
- ServiceDefaults project
- AppHost project
- MongoDB resource configuration
- NPM frontend resource configuration

**QA Engineer: Testing (1.5 hours)**
- Test plan execution
- Integration testing
- End-to-end testing

**Total Team Time: ~2 hours elapsed** (parallel work)

---

### Skill Level Requirements

| Task | Required Skill Level | Notes |
|------|---------------------|-------|
| **Framework Updates** | Junior | Straightforward .csproj edits |
| **Package Updates** | Junior | Standard NuGet operations |
| **JWT Migration** | **Senior** | Security concerns, requires expertise |
| **HTTP Client Review** | Mid-level | Understanding of async/HTTP |
| **Aspire Setup** | **Mid-level** | New tech, follow templates closely |
| **MongoDB Config** | Mid-level | Container/connection string knowledge |
| **NPM Integration** | Mid-level | Node.js + .NET knowledge |
| **Testing** | Mid-level | Integration testing skills |

**Recommended:** Have senior developer lead JWT migration and review.

---

### Complexity Comparison

**This Upgrade vs. Typical Upgrades:**

| Aspect | This Upgrade | Typical .NET 9→10 | Typical .NET Framework→Core |
|--------|-------------|-------------------|----------------------------|
| **Projects** | 5 | 10-20 | 5-50 |
| **Codebase Size** | 4.4K LOC | 50-100K LOC | 100-500K LOC |
| **Deprecated Packages** | 2 | 5-10 | 20-50 |
| **Breaking Changes** | 12 | 20-50 | 100-500 |
| **Framework Conversion** | None | None | All projects |
| **Effort** | 4-5 hours | 2-3 days | 2-4 weeks |
| **Complexity** | **Low** | Medium | High |

**Conclusion:** This is a favorable upgrade scenario.

---

### Unknowns & Assumptions

#### Assumptions

1. ✅ Unit tests exist and are passing
2. ✅ Development environment has Docker (for MongoDB)
3. ✅ `../front` directory exists with valid NPM project
4. ✅ Team has basic Aspire knowledge (or willing to learn)
5. ✅ No hidden dependencies or legacy code
6. ✅ Custom packages (Elyspio.Utils.*) are .NET 10 compatible

#### Unknowns

1. ❓ Quality/coverage of existing tests
   - **Risk:** May not catch regressions
   - **Mitigation:** Add tests during migration if needed

2. ❓ External API (AuthenticationApi) stability
   - **Risk:** API contract changes could break
   - **Mitigation:** Verify API version, regenerate client

3. ❓ MongoDB data migration needs
   - **Risk:** Schema changes might be needed
   - **Mitigation:** Review MongoDB driver release notes

4. ❓ NPM project configuration
   - **Risk:** Start script might not work with Aspire
   - **Mitigation:** Test manually first

5. ❓ Production deployment strategy
   - **Risk:** Not covered in this plan
   - **Mitigation:** Separate deployment planning session

---

### Optimization Opportunities

**During Migration:**
- Consider modernizing to `JsonWebTokenHandler` (JWT)
- Regenerate API client with latest OpenAPI tools
- Add cancellation token support to HTTP calls
- Review and optimize MongoDB queries

**Post-Migration:**
- Leverage .NET 10 performance improvements
- Explore new .NET 10 features
- Optimize Aspire configuration
- Add more comprehensive tests

**Future Enhancements:**
- Migrate to System.Text.Json (from Newtonsoft.Json)
- Add more OpenTelemetry instrumentation
- Implement rate limiting (new .NET 10 features)
- Add distributed caching (Redis via Aspire)

---

## Source Control Strategy

### Branch Structure

```
master (main branch)
  └── upgrade-to-NET10 (upgrade work)
       └── feature branches (optional, for complex changes)
```

**Current Branch:** `upgrade-to-NET10`  
**Source Branch:** `master`  
**Strategy:** Feature branch workflow

---

### Commit Strategy

#### Commit Granularity

Use **logical, atomic commits** that can be individually reviewed and reverted if needed.

#### Recommended Commit Sequence

1. **Initial Setup**
   ```
   git commit -m "chore: create upgrade-to-NET10 branch for .NET 10 migration"
   ```

2. **SDK Validation**
   ```
   git commit -m "chore: validate .NET 10 SDK installation"
   ```

3. **Framework Updates (Per Project)**
   ```
   git commit -m "chore(abstractions): update target framework to net10.0"
   git commit -m "chore(mongo): update target framework to net10.0"
   git commit -m "chore(rest): update target framework to net10.0"
   git commit -m "chore(core): update target framework to net10.0"
   git commit -m "chore(web): update target framework to net10.0"
   ```

4. **Package Updates**
   ```
   git commit -m "chore: update Microsoft.Extensions.* packages to 10.0.3"
   git commit -m "chore: update Newtonsoft.Json to 13.0.4"
   git commit -m "chore: update System.Runtime.Caching to 10.0.3"
   git commit -m "chore: update ASP.NET Core packages to 10.0.3"
   ```

5. **Remove Deprecated Packages**
   ```
   git commit -m "refactor: remove deprecated Microsoft.AspNetCore.Mvc.Core package"
   git commit -m "chore: remove framework-included packages (System.ComponentModel.Annotations, System.Net.Http)"
   ```

6. **JWT Migration**
   ```
   git commit -m "refactor: update System.IdentityModel.Tokens.Jwt to 8.16.0"
   git commit -m "refactor(abstractions): update JWT interfaces for IdentityModel 8.x"
   git commit -m "refactor(rest): update JwtAdapter implementation for IdentityModel 8.x"
   git commit -m "test: verify JWT validation after IdentityModel upgrade"
   ```

7. **Breaking Changes**
   ```
   git commit -m "fix: address binary breaking changes in JWT types"
   git commit -m "fix: review HttpContent behavioral changes in REST adapter"
   git commit -m "fix: update URI validation in RestAdapterModule"
   ```

8. **Aspire Integration**
   ```
   git commit -m "feat: add ServiceDefaults project for Aspire"
   git commit -m "feat: add AppHost project for orchestration"
   git commit -m "feat: configure MongoDB resource in AppHost"
   git commit -m "feat: configure NPM frontend resource in AppHost"
   git commit -m "feat(web): integrate Aspire service defaults"
   git commit -m "refactor(web): update MongoDB configuration for Aspire"
   git commit -m "chore: add ServiceDefaults and AppHost to solution"
   ```

9. **Testing**
   ```
   git commit -m "test: verify all projects build successfully"
   git commit -m "test: run unit tests and validate results"
   git commit -m "test: validate Aspire orchestration"
   ```

10. **Documentation**
    ```
    git commit -m "docs: update README with .NET 10 and Aspire instructions"
    git commit -m "docs: add Aspire setup guide"
    ```

---

### Commit Message Convention

Follow **Conventional Commits** format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `chore`: Maintenance tasks
- `docs`: Documentation
- `test`: Testing
- `perf`: Performance improvement

**Scopes:**
- `abstractions`, `mongo`, `rest`, `core`, `web`
- `aspire`, `servicedefaults`, `apphost`
- `jwt`, `http`, `packages`

**Examples:**
```
feat(aspire): add MongoDB resource configuration
refactor(jwt): migrate to IdentityModel 8.16.0
chore(packages): update Microsoft.Extensions.* to 10.0.3
fix(rest): address HttpContent behavioral changes
docs: update README with Aspire setup instructions
```

---

### Pull Request Strategy

#### When to Create PR

Create PR **after all migration work is complete and tested**:
- ✅ All projects build successfully
- ✅ All tests pass
- ✅ Aspire orchestration works
- ✅ Documentation updated

#### PR Template

```markdown
## .NET 10 Upgrade with Aspire Integration

### Summary
Upgrades all projects from .NET 9.0 to .NET 10.0 LTS and integrates .NET Aspire for orchestration.

### Changes
- ✅ Updated all 5 projects to net10.0
- ✅ Updated 9 NuGet packages to compatible versions
- ✅ Removed 2 deprecated packages, replaced with modern alternatives
- ✅ Removed 2 framework-included packages
- ✅ Fixed 12 binary breaking changes (primarily JWT)
- ✅ Reviewed 146 behavioral changes (HTTP client)
- ✅ Added ServiceDefaults project for Aspire
- ✅ Added AppHost project for orchestration
- ✅ Configured MongoDB resource
- ✅ Configured NPM frontend resource
- ✅ Updated Web project for Aspire integration

### Testing
- [x] All projects build with 0 errors, 0 warnings
- [x] All unit tests pass
- [x] JWT validation works correctly
- [x] MongoDB CRUD operations work
- [x] HTTP client calls succeed
- [x] Aspire AppHost starts successfully
- [x] MongoDB container starts and connects
- [x] NPM frontend starts and communicates with API
- [x] End-to-end workflows tested

### Breaking Changes
- System.IdentityModel.Tokens.Jwt 7.6.2 → 8.16.0 (JWT validation logic updated)
- Microsoft.AspNetCore.Mvc.Core removed (deprecated)
- HttpContent methods have behavioral changes (reviewed and tested)

### Documentation
- [x] README updated with .NET 10 requirements
- [x] README updated with Aspire setup instructions
- [x] Code comments added for Aspire configuration

### Deployment Notes
- Requires .NET 10 SDK
- Requires Docker (for MongoDB via Aspire)
- Requires Node.js (for NPM frontend)
- MongoDB data will persist via Docker volume

### Risks & Rollback
- **Low risk**: Small codebase, comprehensive testing
- **Rollback**: Merge master into this branch or revert PR

### Reviewers
@backend-team @devops-team

### Checklist
- [x] All tasks completed
- [x] All tests passing
- [x] Documentation updated
- [x] No merge conflicts
- [x] Ready for review
```

---

### Code Review Checklist

**Reviewers should verify:**

1. **Build & Compilation**
   - [ ] Solution builds successfully
   - [ ] No compilation warnings
   - [ ] All projects target net10.0

2. **Package Management**
   - [ ] All packages updated to compatible versions
   - [ ] No vulnerable packages
   - [ ] No deprecated packages (except if intentional)

3. **Breaking Changes**
   - [ ] JWT validation logic reviewed and correct
   - [ ] Security implications considered
   - [ ] HTTP client changes reviewed
   - [ ] No obvious regressions

4. **Aspire Configuration**
   - [ ] ServiceDefaults implemented correctly
   - [ ] AppHost configuration is correct
   - [ ] MongoDB resource configured properly
   - [ ] NPM frontend resource configured properly
   - [ ] Environment variables set correctly

5. **Testing**
   - [ ] All tests pass
   - [ ] New tests added if necessary
   - [ ] Integration tests cover Aspire scenarios

6. **Documentation**
   - [ ] README updated
   - [ ] Aspire setup documented
   - [ ] Breaking changes documented

7. **Code Quality**
   - [ ] No code smells introduced
   - [ ] Follows project conventions
   - [ ] Comments added where needed

---

### Merge Strategy

#### Option 1: Squash and Merge (Recommended)

**Pros:**
- Clean, linear history
- Single commit on master
- Easier to revert if needed

**Cons:**
- Loses granular commit history

**When to use:** For cleaner main branch history.

```bash
# GitHub/GitLab: Use "Squash and Merge" button
# Result: Single commit on master with all changes
```

#### Option 2: Merge Commit

**Pros:**
- Preserves all individual commits
- Full audit trail

**Cons:**
- More complex history graph

**When to use:** If granular history is important.

```bash
git checkout master
git merge --no-ff upgrade-to-NET10
git push origin master
```

#### Option 3: Rebase and Merge

**Pros:**
- Linear history
- Preserves individual commits

**Cons:**
- Rewrites commit history
- Can be complex with conflicts

**When to use:** For linear history with preserved commits.

```bash
git checkout upgrade-to-NET10
git rebase master
git checkout master
git merge upgrade-to-NET10
git push origin master
```

**Recommendation:** Use **Squash and Merge** for this upgrade.

---

### Post-Merge Actions

1. **Tag the Release**
   ```bash
   git tag -a v2.0.0-net10 -m "Upgraded to .NET 10 with Aspire"
   git push origin v2.0.0-net10
   ```

2. **Update CI/CD**
   - Update build pipelines for .NET 10
   - Update Docker images for .NET 10
   - Update deployment scripts

3. **Notify Team**
   - Announce upgrade completion
   - Share migration notes
   - Provide Aspire setup instructions

4. **Clean Up**
   ```bash
   # Optionally delete upgrade branch after merge
   git branch -d upgrade-to-NET10
   git push origin --delete upgrade-to-NET10
   ```

---

### Conflict Resolution

**If conflicts occur during merge:**

1. **Identify Conflicts**
   ```bash
   git checkout master
   git merge upgrade-to-NET10
   # Conflicts will be shown
   ```

2. **Resolve Conflicts**
   - Prefer upgrade branch changes for .csproj files
   - Carefully review code conflicts
   - Test after resolving

3. **Complete Merge**
   ```bash
   git add .
   git commit -m "chore: merge upgrade-to-NET10 into master"
   git push origin master
   ```

**Common Conflict Areas:**
- `.csproj` files (target framework, packages)
- `Program.cs` (Aspire integration)
- `appsettings.json` (configuration)

---

### Backup & Recovery

**Before Merge:**
1. **Create Backup Branch**
   ```bash
   git checkout master
   git branch backup-before-net10-upgrade
   git push origin backup-before-net10-upgrade
   ```

2. **Tag Current State**
   ```bash
   git tag pre-net10-upgrade
   git push origin pre-net10-upgrade
   ```

**Recovery Options:**

**Option 1: Revert Merge Commit**
```bash
git revert -m 1 <merge-commit-hash>
git push origin master
```

**Option 2: Reset to Pre-Merge State**
```bash
git reset --hard pre-net10-upgrade
git push origin master --force  # ⚠️ Use with caution
```

**Option 3: Restore from Backup Branch**
```bash
git checkout master
git reset --hard backup-before-net10-upgrade
git push origin master --force  # ⚠️ Use with caution
```

---

### Git Workflow Summary

```
1. Create branch: upgrade-to-NET10
2. Make changes with atomic commits
3. Test thoroughly
4. Push branch to origin
5. Create pull request
6. Code review
7. Address feedback
8. Merge to master (squash recommended)
9. Tag release
10. Clean up branch
11. Deploy to environments
```

**Estimated Timeline:**
- Development: 4-5 hours
- Code review: 1-2 hours
- Merge & deployment prep: 1 hour
- **Total: 1 working day**

---

## Success Criteria

### Primary Success Criteria

#### 1. ✅ All Projects Target .NET 10.0

**Verification:**
```bash
# Check target frameworks
grep -r "<TargetFramework>" --include="*.csproj"

# Expected output (for each project):
# <TargetFramework>net10.0</TargetFramework>
```

**Success:** All 5 projects + 2 new Aspire projects target `net10.0`

---

#### 2. ✅ Solution Builds Successfully

**Verification:**
```bash
dotnet clean
dotnet restore
dotnet build --configuration Release
```

**Success Criteria:**
- 0 compilation errors
- 0 warnings (or only expected/informational warnings)
- Build time reasonable (< 2 minutes for solution)

---

#### 3. ✅ All Tests Pass

**Verification:**
```bash
dotnet test --configuration Release --verbosity normal
```

**Success Criteria:**
- All existing tests pass
- No new test failures introduced
- Test coverage maintained or improved

---

#### 4. ✅ Package Compatibility Achieved

**Verification:**
```bash
dotnet list package --vulnerable
dotnet list package --deprecated
dotnet list package --outdated
```

**Success Criteria:**
- ✅ No vulnerable packages
- ✅ No deprecated packages (except known, documented exceptions)
- ✅ All packages compatible with net10.0
- ✅ 9 packages updated to 10.0.3
- ✅ 2 deprecated packages replaced
- ✅ 2 framework-included packages removed

**Expected Package Versions:**
- Microsoft.Extensions.* → 10.0.3
- Microsoft.AspNetCore.Mvc.NewtonsoftJson → 10.0.3
- System.Runtime.Caching → 10.0.3
- System.IdentityModel.Tokens.Jwt → 8.16.0
- Newtonsoft.Json → 13.0.4

---

#### 5. ✅ Breaking Changes Addressed

**JWT Validation:**
- [ ] System.IdentityModel.Tokens.Jwt updated to 8.16.0
- [ ] JWT interfaces updated (Abstractions)
- [ ] JWT implementation updated (Rest)
- [ ] All JWT tests pass
- [ ] Authentication flows work correctly

**HTTP Client:**
- [ ] Behavioral changes reviewed
- [ ] Auto-generated API client tested
- [ ] All HTTP requests succeed
- [ ] Error handling works correctly

**Other:**
- [ ] Scrutor DI scanning works
- [ ] Activity tracing works
- [ ] URI validation works

**Success:** All 12 binary breaking changes resolved, 146 behavioral changes reviewed

---

#### 6. ✅ Aspire Integration Successful

**ServiceDefaults:**
- [ ] Project created and builds
- [ ] OpenTelemetry configured
- [ ] Health checks configured
- [ ] Service discovery configured

**AppHost:**
- [ ] Project created and builds
- [ ] Runs successfully: `dotnet run --project AppHost`
- [ ] Aspire dashboard opens (http://localhost:15888)
- [ ] All resources visible in dashboard

**MongoDB Resource:**
- [ ] Container starts automatically
- [ ] Connection string injected to API
- [ ] API connects to MongoDB successfully
- [ ] CRUD operations work
- [ ] Data persists across restarts (volume works)

**NPM Frontend Resource:**
- [ ] Frontend starts automatically
- [ ] Accessible at assigned port (e.g., http://localhost:3000)
- [ ] Environment variables set correctly (API URL)
- [ ] Can call API endpoints successfully

**Web Integration:**
- [ ] ServiceDefaults reference added
- [ ] `AddServiceDefaults()` called in Program.cs
- [ ] `MapDefaultEndpoints()` configured
- [ ] Health endpoints work (/health, /alive)

**Success:** Complete orchestration of .NET API + MongoDB + NPM frontend via Aspire

---

#### 7. ✅ Application Functions Correctly

**Core Functionality:**
- [ ] Application starts without errors
- [ ] All API endpoints accessible
- [ ] Authentication works (login, token validation)
- [ ] Database operations work (read, write, update, delete)
- [ ] External API calls work (AuthenticationApi)
- [ ] Frontend loads and displays correctly
- [ ] Frontend-to-API communication works

**Smoke Tests:**
```bash
# Health check
curl http://localhost:5000/health

# Swagger UI
curl http://localhost:5000/swagger

# Frontend
curl http://localhost:3000

# Sample API call
curl http://localhost:5000/api/your-endpoint
```

**Success:** All user-facing functionality works as expected

---

### Secondary Success Criteria

#### 8. ✅ Performance Maintained or Improved

**Metrics:**
- API response times within acceptable range
- Memory usage reasonable
- CPU usage reasonable
- No memory leaks
- Build times acceptable

**Benchmarking:**
```bash
# Compare before/after
# - API response time for typical request
# - Memory usage at idle
# - Build time for solution
```

**Success:** Performance equal to or better than .NET 9 version

---

#### 9. ✅ Documentation Updated

**README.md:**
- [ ] .NET 10 SDK requirement documented
- [ ] Docker requirement documented (for MongoDB)
- [ ] Node.js requirement documented (for frontend)
- [ ] Aspire setup instructions added
- [ ] Running via AppHost documented
- [ ] Environment variables documented

**Code Comments:**
- [ ] Aspire configuration commented
- [ ] JWT migration changes commented
- [ ] Complex logic explained

**Migration Notes:**
- [ ] Breaking changes documented
- [ ] Migration decisions documented
- [ ] Known issues documented (if any)

**Success:** Complete, accurate documentation for developers

---

#### 10. ✅ Code Quality Maintained

**Standards:**
- [ ] Follows existing code conventions
- [ ] No code smells introduced
- [ ] Proper error handling
- [ ] Appropriate logging
- [ ] Security best practices followed

**Static Analysis:**
```bash
# If using analyzers
dotnet build /p:TreatWarningsAsErrors=true
```

**Success:** Code quality equal to or better than before upgrade

---

### Acceptance Testing

#### Scenario 1: Developer Onboarding

**Test:** New developer can set up and run project

**Steps:**
1. Clone repository
2. Install .NET 10 SDK
3. Install Docker
4. Run `dotnet run --project AppHost/AppHost.csproj`
5. Access Aspire dashboard
6. Access frontend
7. Test API

**Success:** Developer can run project in < 15 minutes

---

#### Scenario 2: Authentication Flow

**Test:** User authentication works end-to-end

**Steps:**
1. Start application via AppHost
2. Open frontend
3. Navigate to login page
4. Enter credentials
5. Submit login
6. Receive JWT token
7. Make authenticated API call
8. Verify authorized access

**Success:** Complete authentication flow works

---

#### Scenario 3: Data Persistence

**Test:** Data persists correctly

**Steps:**
1. Start application via AppHost
2. Create data via API or frontend
3. Verify data saved to MongoDB
4. Stop AppHost
5. Restart AppHost
6. Verify data still exists

**Success:** Data persists across restarts

---

#### Scenario 4: Error Recovery

**Test:** Application handles errors gracefully

**Steps:**
1. Start application via AppHost
2. Stop MongoDB container manually
3. Attempt API call that requires database
4. Verify appropriate error response
5. Check health endpoint shows unhealthy
6. Restart MongoDB container
7. Verify API recovers automatically
8. Verify health endpoint shows healthy

**Success:** Graceful degradation and recovery

---

### Rollback Success Criteria

**If rollback is necessary:**

- [ ] Can switch back to master branch
- [ ] .NET 9 version still works
- [ ] All tests pass on master
- [ ] No data loss
- [ ] Documented why rollback was necessary

---

### Sign-Off Checklist

**Technical Lead:**
- [ ] Code review completed
- [ ] Architecture validated
- [ ] Security reviewed
- [ ] Performance acceptable

**QA Lead:**
- [ ] All tests pass
- [ ] Integration testing complete
- [ ] End-to-end scenarios validated
- [ ] No critical bugs

**DevOps Lead:**
- [ ] Aspire configuration validated
- [ ] Container orchestration works
- [ ] Deployment strategy reviewed
- [ ] Monitoring configured

**Product Owner:**
- [ ] Functionality preserved
- [ ] User experience maintained
- [ ] Documentation adequate
- [ ] Ready for next environment

---

### Definition of Done

The .NET 10 upgrade is **COMPLETE** when:

1. ✅ All 7 projects target net10.0
2. ✅ Solution builds with 0 errors, 0 warnings
3. ✅ All tests pass (100% pass rate)
4. ✅ All 9 packages updated successfully
5. ✅ 2 deprecated packages replaced
6. ✅ 2 framework-included packages removed
7. ✅ All 12 binary breaking changes fixed
8. ✅ All 146 behavioral changes reviewed
9. ✅ Aspire integration complete and working
10. ✅ MongoDB orchestrated via Aspire
11. ✅ NPM frontend orchestrated via Aspire
12. ✅ Application functions correctly end-to-end
13. ✅ Documentation updated
14. ✅ Code committed to upgrade-to-NET10 branch
15. ✅ Pull request created and reviewed
16. ✅ All sign-offs obtained
17. ✅ Changes merged to master
18. ✅ Release tagged

---

### Celebration 🎉

**When all success criteria met:**

- ✨ **Congratulations!** Your solution is now running on .NET 10 LTS
- 🚀 **Enhanced:** With modern Aspire orchestration
- 🎯 **Validated:** Through comprehensive testing
- 📚 **Documented:** For team and future reference
- 🔒 **Secure:** With updated packages and security best practices
- ⚡ **Performant:** Leveraging .NET 10 improvements

**Next Steps:**
1. Deploy to staging environment
2. Monitor for issues
3. Collect feedback
4. Plan production deployment
5. Explore new .NET 10 features
6. Optimize further with Aspire insights

**Well done! 🎊**

---

### Appendix: Verification Commands

**Quick verification script:**

```bash
#!/bin/bash

echo "=== .NET 10 Upgrade Verification ==="

echo "1. Checking target frameworks..."
grep -r "<TargetFramework>net10.0</TargetFramework>" --include="*.csproj" | wc -l
# Expected: 7 (5 existing + 2 Aspire)

echo "2. Building solution..."
dotnet build --configuration Release
# Expected: Build succeeded

echo "3. Running tests..."
dotnet test --configuration Release --no-build
# Expected: All tests passed

echo "4. Checking for vulnerabilities..."
dotnet list package --vulnerable
# Expected: No vulnerable packages found

echo "5. Checking for deprecated packages..."
dotnet list package --deprecated
# Expected: No deprecated packages found

echo "6. Starting Aspire AppHost..."
dotnet run --project AppHost/AppHost.csproj &
APPHOST_PID=$!
sleep 30

echo "7. Checking Aspire dashboard..."
curl -f http://localhost:15888 || echo "Dashboard not accessible"

echo "8. Checking API health..."
curl -f http://localhost:5000/health || echo "API not healthy"

echo "9. Checking frontend..."
curl -f http://localhost:3000 || echo "Frontend not accessible"

echo "10. Stopping AppHost..."
kill $APPHOST_PID

echo "=== Verification Complete ==="
```

Run with: `bash verify-upgrade.sh`
