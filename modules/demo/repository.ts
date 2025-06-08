// Simply the place where you contain database access operations only.

// Detailed breakdown:
// This file is responsible for implementing data access operations and database interactions.
// It ensures separation of concerns by keeping database operations separate from business logic:
// - Service layer delegates all database calls to repository functions
// - Repository layer handles model interactions, queries, and data transformations
// - This abstraction provides flexibility for future database changes or migrations
// Each function in this file corresponds to a specific database operation and performs the following:
// 1. Executes database queries using the appropriate models.
// 2. Handles data transformation between database models and application types.
// 3. Returns clean data structures to the service layer.

// Benefits of this architecture:
// - Easy to switch databases (MongoDB to PostgreSQL, etc.) without changing business logic
// - Simplified testing by mocking repository functions instead of database connections
// - Clear separation between data access and business rules
// - Centralized database operation management


// export const createItem = async (data: ItemInput) => {
//     const newItem = new DemoModel(data);
//     await newItem.save();
//     return transformToItemType(newItem);
// };
