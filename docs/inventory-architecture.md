# Inventory Management System — Architecture & Project Roadmap

**Project:** Inventory Management System  
**Framework:** Laravel + React + Inertia + TypeScript  
**Database:** PostgreSQL  
**Currency:** Algerian Dinar (DZD)  
**Business structure:** One business initially  
**Warehouse structure:** Multiple warehouses  
**Project status:** Architecture and planning phase

---

# 1. Project Overview

The objective is to develop a complete inventory management application for businesses.

The application will allow a business to manage:

- Products and product classifications.
- Suppliers and customers.
- Purchases and sales.
- Stock quantities and warehouse locations.
- Stock movements and inventory history.
- Batch and expiration-date tracking.
- Serialized products and IMEI numbers.
- Product barcodes, including EAN-13.
- Operating expenses and additional costs.
- Profitability and financial reports.
- Users, roles, and permissions.

The first version will support one business with multiple warehouses. The architecture should remain extensible for possible future multi-company functionality or additional modules.

# 2. Confirmed Architectural Decisions

| Decision | Selected configuration |
|---|---|
| Business structure | One business initially |
| Currency | DZD |
| Users | Multiple users with roles and permissions |
| Warehouses | Multiple warehouses supported |
| Initial warehouse setup | One default warehouse |
| Stock valuation | Undecided: Weighted Average Cost or FIFO |
| Expiration management | Only for products that require it |
| Barcode management | Existing manufacturer barcodes and internally generated barcodes |
| Barcode standard | EAN-13 support |

# 3. Product Catalogue

The existing `products` table will be extended rather than replaced.

## 3.1 Product types

The application must support five product types:

### 1. Simple products
Examples: keyboards, USB cables, accessories.

Stock is tracked by quantity and measurement unit.

### 2. Bulk or measured products
Examples: rice, fabric, electrical cable.

Must support fractional quantities, such as:
- 2.5 kg
- 4.75 meters
- 1.25 liters

### 3. Batch-tracked products
Examples: food, cosmetics, and products requiring batch tracking.

Each batch can have:
- Batch number.
- Quantity.
- Production date, where applicable.
- Expiration date, where applicable.

FEFO (First Expired, First Out) will be used for products with expiration dates.

### 4. Serialized products
Examples: computers, smartphones, and electronic equipment.

Each physical unit must be individually tracked using:
- Serial number.
- IMEI, when applicable.
- Purchase information.
- Warehouse location.
- Sale information.
- Current status.

### 5. Services and virtual products
Examples: repairs, installation, and labor.

Services have costs and selling prices but do not generate physical stock movements.

## 3.2 Product information

The product catalogue should support:

- Internal reference / SKU.
- Product name or designation.
- Description.
- Family.
- Subfamily.
- Product type.
- Brand.
- Model.
- Color.
- Measurement unit.
- Selling price.
- Minimum stock threshold.
- Image.
- Barcode identifiers.
- Expiration tracking configuration.
- Active or archived status.

## 3.3 Catalogue tables

Proposed tables:

- `products`
- `families`
- `sub_families`
- `brands`
- `units`
- `product_barcodes`
- `product_variants`

A product may have multiple barcodes, but each barcode must be unique.

EAN-13 validation must include the 13-digit format and check digit. Internally generated numbers must not be represented as GS1-registered commercial codes without an authorized GS1 allocation.

Variants should be used when differences such as size, color, or storage capacity require separate stock tracking.

# 4. Inventory Management

Inventory is the central component of the application.

## 4.1 Warehouses

The application must support multiple warehouses.

Examples:
- Main store.
- Secondary storage.
- Branch warehouse.

Each warehouse maintains its own product quantities.

Proposed table:

`warehouses`

Fields include:
- id
- name
- code
- address
- is_default
- is_active
- timestamps

## 4.2 Stock balances

Proposed table:

`stock_balances`

Stores current quantities per product and warehouse.

Important fields:
- product_id
- warehouse_id
- quantity_on_hand
- quantity_reserved
- average_cost, where applicable

A unique constraint must exist on the combination of product and warehouse.

Available stock:

`quantity_available = quantity_on_hand - quantity_reserved`

## 4.3 Stock movements

Proposed table:

`stock_movements`

Every validated stock operation must be recorded.

Movement types include:
- Purchase receipt.
- Sale.
- Customer return.
- Supplier return.
- Stock adjustment.
- Warehouse transfer.
- Initial inventory.

Each movement should record:
- Product.
- Warehouse.
- Quantity.
- Direction (entry or exit).
- Unit cost, when applicable.
- Source document.
- User responsible.
- Date and time.
- Unique operation identifier.

Stock movements must be auditable and should never be silently deleted or edited. Corrections must use reversal or adjustment movements.

Stock changes and transaction validation must happen atomically within database transactions.

## 4.4 Stock equation

`Stock = Initial quantity + Entries - Exits + Adjustments`

Stock balances will be maintained for efficient display, while stock movements provide the historical record.

## 4.5 Additional inventory tables

- `stock_transfers`
- `stock_transfer_lines`
- `stock_lots`
- `stock_serials`
- `inventory_counts`
- `inventory_count_lines`
- `stock_reservations`

Warehouse transfers must generate linked stock exit and entry movements.

# 5. Suppliers and Customers

Suppliers and customers are business records. They do not need application accounts.

## 5.1 Suppliers

Proposed table: `suppliers`

Information:
- Name.
- Company.
- Phone.
- Email.
- Address.
- Tax identifier.
- Notes.

## 5.2 Customers

Proposed table: `customers`

Information:
- Name.
- Company.
- Phone.
- Email.
- Address.
- Tax identifier.
- Notes.

Both should have transaction histories and outstanding balance information.

# 6. Purchasing Module

A purchase document can contain multiple products.

Proposed tables:

- `purchases`
- `purchase_lines`
- `purchase_receipts`
- `purchase_receipt_lines`
- `purchase_payments`

Purchase statuses:
- Draft.
- Ordered.
- Partially received.
- Received.
- Cancelled.

Important rules:

- Ordered quantities and received quantities must be distinguished.
- Partial deliveries must be supported.
- Stock increases only when a physical receipt is validated.
- Purchase costs must be recorded for profitability calculations.

# 7. Sales Module

A sale can contain multiple products and services.

Proposed tables:

- `sales`
- `sale_lines`
- `sale_payments`
- `returns`
- `return_lines`

A sale line should preserve a snapshot of:
- Product name.
- Quantity.
- Selling price.
- Discount.
- Tax information.
- Cost information, where applicable.

Important rules:

- Draft sales must not deduct stock.
- Validated sales deduct physical stock.
- Services do not generate stock movements.
- Returns must be traceable.
- Accepted physical returns can generate stock entry movements.

# 8. Stock Valuation

The accounting valuation method has not yet been selected.

Two methods are under consideration:

## Weighted Average Cost

The average unit cost is calculated from the total inventory value divided by the total inventory quantity.

Advantages:
- Simpler cost calculations.
- Useful for interchangeable products.
- Easier profitability reporting.

## FIFO — First In, First Out

The oldest acquisition cost layers are consumed first.

Advantages:
- Preserves acquisition cost layers.
- Useful when purchase prices vary.
- Detailed historical cost tracking.

## Proposed technical approach

Design the database to support both methods.

Proposed table:

`stock_cost_layers`

Possible fields:
- Product.
- Warehouse.
- Purchase receipt line.
- Original quantity.
- Remaining quantity.
- Unit acquisition cost.
- Receipt date.

The selected valuation method will eventually be stored in business settings.

Important distinction:

- FIFO determines which purchase cost layer is consumed first.
- FEFO determines which expiring batch is physically issued first.

These are different concepts.

The cost assigned to each sale line must be preserved so historical profitability does not change when new stock arrives.

# 9. Costs and Financial Management

The application must distinguish product acquisition costs from operating and indirect costs.

Proposed tables:

- `cost_categories`
- `cost_entries`
- `cost_allocations`

Examples of cost categories:

- Transportation.
- Labor.
- Equipment downtime.
- Emergency delivery procedures.
- Schedule changes.
- Additional subcontracting.
- General operating expenses.

Lost orders and reputation-related impacts should be recorded as estimated economic losses, separately from actual cash expenses.

## Profitability

Gross profit:

`Gross Profit = Sales Revenue - Cost of Goods Sold`

Operating result:

`Operating Result = Gross Profit - Operating Expenses`

The application should eventually calculate profitability:
- Per product.
- Per sale.
- Per customer.
- Per period.
- For the entire business.

# 10. Users, Roles, and Permissions

The existing `users` table will be preserved.

The application will support multiple users with role-based access.

Proposed tables:

- `roles`
- `permissions`
- `user_roles`
- `role_permissions`

Initial roles:

| Role | Responsibilities |
|---|---|
| Admin | Full access |
| Stock manager | Inventory and warehouses |
| Purchasing manager | Suppliers and purchases |
| Salesperson | Customers and sales |
| Accountant | Payments, costs and reports |

A user may eventually have multiple roles.

# 11. Business Settings

Proposed table:

`business_settings`

Information:
- Business name.
- Address.
- Contact information.
- Currency (DZD).
- Default warehouse.
- Stock valuation method.
- Tax configuration.
- Invoice numbering configuration.

This will allow future configuration without hardcoding business rules.

# 12. Complete Proposed Database Structure

| Domain | Tables |
|---|---|
| Authentication | Existing users and authentication tables |
| Authorization | roles, permissions, user_roles, role_permissions |
| Configuration | business_settings |
| Catalogue | products, families, sub_families, brands, units, product_barcodes, product_variants |
| Warehouses | warehouses |
| Inventory | stock_balances, stock_movements, stock_lots, stock_serials |
| Transfers | stock_transfers, stock_transfer_lines |
| Inventory audits | inventory_counts, inventory_count_lines |
| Reservations | stock_reservations |
| Contacts | suppliers, customers |
| Purchasing | purchases, purchase_lines, purchase_receipts, purchase_receipt_lines, purchase_payments |
| Sales | sales, sale_lines, sale_payments |
| Returns | returns, return_lines |
| Finance | cost_categories, cost_entries, cost_allocations |
| Cost valuation | stock_cost_layers |

This is the target logical architecture. Optional components can be implemented when their functionality is developed.

# 13. Existing Application — Preservation Strategy

The current Laravel application already contains:

- Users and authentication.
- Families.
- Products.
- Marketplace orders.
- Product CRUD.
- Product filtering and pagination.
- Reusable DataTable components.
- Role and ownership checks.

Existing database migrations have been executed successfully.

Existing tables and records must be preserved.

The `orders` table belongs to the original marketplace workflow and should remain separate from the new inventory sales module.

The current `products` table will be extended incrementally.

The existing marketplace functionality can be isolated or retired later without blocking inventory development.

# 14. Implementation Roadmap

## Phase 1 — Product Catalogue
- Extend products.
- Subfamilies.
- Brands.
- Units.
- Product barcodes.
- Product types.
- Business settings.

## Phase 2 — Inventory Engine
- Warehouses.
- Stock balances.
- Stock movements.
- Warehouse transfers.
- Lots and expiration dates.
- Serial numbers.
- Inventory counts.
- Reservations.

## Phase 3 — Suppliers and Customers
- Supplier management.
- Customer management.
- Contact histories.

## Phase 4 — Purchasing
- Purchase documents.
- Purchase lines.
- Partial receipts.
- Supplier payments.
- Stock integration.

## Phase 5 — Sales
- Sales documents.
- Multiple sale lines.
- Stock deduction.
- Customer payments.
- Returns.

## Phase 6 — Finance
- Expenses.
- Cost allocation.
- Stock valuation.
- Profitability.

## Phase 7 — Dashboard and Reports
- Stock alerts.
- Low-stock reports.
- Expiration alerts.
- Sales and purchase statistics.
- Financial reports.
- Export functionality.

# 15. Technical Rules

1. Draft transactions must not change physical stock.
2. Validated receipts increase stock.
3. Validated sales decrease stock.
4. Services must never create physical stock movements.
5. Bulk products must support decimal quantities.
6. Batch products must support multiple lots.
7. Expiration dates are optional when not applicable.
8. Serialized units must have unique identifiers.
9. Barcodes must be unique.
10. Stock must not become negative without explicit authorization.
11. Historical stock movements must remain traceable.
12. Transactions and stock changes must be atomic.
13. Products with transaction history must be archived rather than deleted.
14. Financial calculations must use decimal arithmetic rather than floating-point calculations.
15. The application must preserve historical transaction prices and costs.

# 16. Next Development Session

Before creating migrations:

1. Inspect the actual PostgreSQL schema.
2. Confirm the installed Laravel version.
3. Review existing table columns, indexes and constraints.
4. Finalize the first catalogue migrations.
5. Implement and test each migration group separately.

Commands to run:

```bash
php artisan db:table products
php artisan db:table users
php artisan db:table orders
php artisan --version
```

**Immediate next objective: Phase 1 — Product Catalogue.**

No new migrations have been created yet. All new database changes must be introduced incrementally while preserving existing application data.
