# React API Template .NET 10.0 Upgrade Tasks

## Overview

This document tracks the execution of the React API Template upgrade from .NET 9.0 to .NET 10.0 LTS. All 5 projects will be upgraded simultaneously in a single atomic operation, followed by .NET Aspire integration for modern cloud-native orchestration.

**Progress**: 0/4 tasks complete (0%) ![0%](https://progress-bar.xyz/0)

---

## Tasks

### [▶] TASK-001: Verify prerequisites
**References**: Plan §Phase 1 Preparation & Setup

- [▶] (1) Verify .NET 10 SDK is installed and accessible
- [ ] (2) .NET 10 SDK version meets minimum requirements (**Verify**)

---

### [ ] TASK-002: Atomic framework and package upgrade with breaking changes
**References**: Plan §Phase 2-3, Plan §Package Update Reference, Plan §Breaking Changes Catalog

- [ ] (1) Update TargetFramework to net10.0 in all 5 projects per Plan §Project-by-Project Migration Plans
- [ ] (2) All project files updated to net10.0 (**Verify**)
- [ ] (3) Update package references per Plan §Package Update Reference (9 packages to update)
- [ ] (4) All package references updated (**Verify**)
- [ ] (5) Remove deprecated packages per Plan §Package Update Reference (Microsoft.AspNetCore.Mvc.Core, System.IdentityModel.Tokens.Jwt 7.6.2)
- [ ] (6) Add System.IdentityModel.Tokens.Jwt 8.16.0 replacement package
- [ ] (7) Remove framework-included packages per Plan §Package Update Reference (System.ComponentModel.Annotations, System.Net.Http)
- [ ] (8) Deprecated and framework-included packages handled correctly (**Verify**)
- [ ] (9) Restore all dependencies
- [ ] (10) All dependencies restored successfully (**Verify**)
- [ ] (11) Build solution and fix all compilation errors per Plan §Breaking Changes Catalog (focus: JWT types in Abstractions/Rest projects, HttpContent methods in Rest/AuthenticationApi)
- [ ] (12) Solution builds with 0 errors (**Verify**)
- [ ] (13) Commit changes with message: "TASK-002: Upgrade all projects to .NET 10.0 with package updates and breaking change fixes"

---

### [ ] TASK-003: Aspire integration
**References**: Plan §Phase 4, Plan §Aspire Integration Strategy

- [ ] (1) Create ServiceDefaults project per Plan §Aspire Integration Strategy Step 1
- [ ] (2) ServiceDefaults project created and builds (**Verify**)
- [ ] (3) Create AppHost project per Plan §Aspire Integration Strategy Step 2
- [ ] (4) AppHost project created and builds (**Verify**)
- [ ] (5) Configure MongoDB resource in AppHost/Program.cs per Plan §Aspire Integration Strategy Step 2
- [ ] (6) Configure NPM frontend resource in AppHost/Program.cs for path ../../front per Plan §Aspire Integration Strategy Step 2
- [ ] (7) Add API project reference and environment configuration in AppHost per Plan §Aspire Integration Strategy
- [ ] (8) AppHost resources configured correctly (**Verify**)
- [ ] (9) Add ServiceDefaults project reference to Web project per Plan §Aspire Integration Strategy Step 3
- [ ] (10) Update Web/Program.cs to call AddServiceDefaults() and MapDefaultEndpoints() per Plan §Aspire Integration Strategy Step 3
- [ ] (11) Web project Aspire integration complete (**Verify**)
- [ ] (12) Add ServiceDefaults and AppHost projects to solution file
- [ ] (13) Build solution with all Aspire projects
- [ ] (14) Solution builds with 0 errors including Aspire projects (**Verify**)
- [ ] (15) Commit changes with message: "TASK-003: Add .NET Aspire integration with MongoDB and NPM frontend orchestration"

---

### [ ] TASK-004: Run full test suite and validate upgrade
**References**: Plan §Phase 5 Testing & Validation Strategy

- [ ] (1) Run tests in all test projects if present in solution
- [ ] (2) Fix any test failures referencing Plan §Breaking Changes Catalog for JWT validation and HTTP client behavioral changes
- [ ] (3) Re-run tests after fixes
- [ ] (4) All tests pass with 0 failures (**Verify**)
- [ ] (5) Commit changes with message: "TASK-004: Complete testing and validation"

---
