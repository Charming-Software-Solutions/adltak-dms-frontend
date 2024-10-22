import { TaskStatusEnum, UserRoleEnum } from "@/enums";
import { Distribution } from "@/types/distribution";
import { Brand, Category, Product, Type } from "@/types/product";
import { Task } from "@/types/task";
import { User } from "@/types/user";
import { v4 as uuidv4 } from "uuid";

// Fake data for Brand
const brands: Brand[] = [
  { id: uuidv4(), name: "TechGear" },
  { id: uuidv4(), name: "EcoFriendly" },
  { id: uuidv4(), name: "LuxeLife" },
];

// Fake data for Category
const categories: Category[] = [
  {
    id: uuidv4(),
    name: "Electronics",
    description: "Electronic devices and accessories",
  },
  {
    id: uuidv4(),
    name: "Home & Kitchen",
    description: "Items for your home and kitchen",
  },
  { id: uuidv4(), name: "Fashion", description: "Clothing and accessories" },
];

// Fake data for Type
const types: Type[] = [
  { id: uuidv4(), name: "Smartphone" },
  { id: uuidv4(), name: "Appliance" },
  { id: uuidv4(), name: "Apparel" },
];

// Fake data for Product
const products: Product[] = [
  {
    id: uuidv4(),
    sku: "TG-SP-001",
    name: "TechGear Smartphone X1",
    brand: brands[0],
    category: categories[0],
    type: types[0],
    description: "High-performance smartphone with advanced features",
    thumbnail: "https://example.com/images/smartphone-x1.jpg",
    status: "In Stock",
    stock: 100,
  },
  {
    id: uuidv4(),
    sku: "TG-SW-001",
    name: "TechGear Smartwatch S1",
    brand: brands[0],
    category: categories[0],
    type: types[0],
    description: "Cutting-edge smartwatch with health tracking",
    thumbnail: "https://example.com/images/smartwatch-s1.jpg",
    status: "In Stock",
    stock: 75,
  },
  {
    id: uuidv4(),
    sku: "EF-AP-001",
    name: "EcoFriendly Smart Kettle",
    brand: brands[1],
    category: categories[1],
    type: types[1],
    description: "Energy-efficient smart kettle",
    thumbnail: "https://example.com/images/smart-kettle.jpg",
    status: "In Stock",
    stock: 50,
  },
  {
    id: uuidv4(),
    sku: "EF-AP-002",
    name: "EcoFriendly Air Purifier",
    brand: brands[1],
    category: categories[1],
    type: types[1],
    description: "Advanced air purifier for cleaner home",
    thumbnail: "https://example.com/images/air-purifier.jpg",
    status: "In Stock",
    stock: 30,
  },
  {
    id: uuidv4(),
    sku: "LL-TS-001",
    name: "LuxeLife Designer T-Shirt",
    brand: brands[2],
    category: categories[2],
    type: types[2],
    description: "Premium designer t-shirt",
    thumbnail: "https://example.com/images/designer-tshirt.jpg",
    status: "Low Stock",
    stock: 10,
  },
  {
    id: uuidv4(),
    sku: "LL-JN-001",
    name: "LuxeLife Jeans",
    brand: brands[2],
    category: categories[2],
    type: types[2],
    description: "High-quality designer jeans",
    thumbnail: "https://example.com/images/designer-jeans.jpg",
    status: "In Stock",
    stock: 25,
  },
];

// Fake data for User (logistics person)
const users: User[] = [
  { id: uuidv4(), email: "john.doe@example.com" },
  { id: uuidv4(), email: "jane.smith@example.com" },
];

const distributions: Distribution[] = [
  {
    id: uuidv4(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    products: [
      { product: products[0], quantity: 10 },
      { product: products[1], quantity: 5 },
    ],
    type: "export", // Set type here
    status: "pending", // Set initial status
    client: "TechStore Inc.",
    logistics_person: users[0],
  },
  {
    id: uuidv4(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    products: [
      { product: products[2], quantity: 5 },
      { product: products[3], quantity: 3 },
    ],
    type: "import", // Set type here
    status: "in transit", // Set initial status
    client: "GreenHome Appliances",
    logistics_person: users[1],
  },
  {
    id: uuidv4(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    products: [
      { product: products[4], quantity: 3 },
      { product: products[5], quantity: 2 },
    ],
    type: "export", // Set type here
    status: "delivered", // Set initial status
    client: "Fashion Boutique",
    logistics_person: users[0],
  },
];

const inventoryTasks: Task[] = [
  {
    id: "1f9e76d2-16be-4f9b-9bc5-438ddc78fa2b",
    created_at: "2024-10-12T09:14:11.000Z",
    updated_at: "2024-10-12T10:00:45.000Z",
    employee: {
      id: "ec1d9ba2-3a82-49d7-b6b9-0e91f682a44d",
      created_at: "2023-07-01T08:20:45.000Z",
      updated_at: "2024-09-30T11:45:00.000Z",
      name: "James Brown",
      user: {
        id: "u12345abcd",
        last_login: null,
        email: "james.brown@example.com",
        is_active: true,
        is_staff: false,
        role: UserRoleEnum.LOGISTICS,
        groups: [],
        user_permissions: [],
        refresh: "refresh-token",
        access: "access-token",
      },
    },
    name: "Plan Distribution of New Stock",
    description:
      "Coordinate the distribution of newly arrived stock to various regional warehouses.",
    status: TaskStatusEnum.IN_PROGRESS,
  },
  {
    id: "b8e99e34-8a82-4dd8-a24f-c8db33efb2ef",
    created_at: "2024-10-11T10:15:12.000Z",
    updated_at: "2024-10-12T12:02:20.000Z",
    employee: {
      id: "f91b7659-9d43-4b18-9f3e-9d2a9a1c9e4b",
      created_at: "2024-01-15T10:12:45.000Z",
      updated_at: "2024-09-28T14:25:45.000Z",
      name: "Sophia Lee",
      user: {
        id: "u23456bcde",
        last_login: null,
        email: "sophia.lee@example.com",
        is_active: true,
        is_staff: false,
        role: UserRoleEnum.WAREHOUSE,
        groups: [],
        user_permissions: [],
        refresh: "refresh-token",
        access: "access-token",
      },
    },
    name: "Count Current Stock Levels",
    description:
      "Conduct a physical count of current stock levels and compare them with system records for discrepancies.",
    status: TaskStatusEnum.TODO,
  },
  {
    id: "3c9e46d9-ae82-4db2-9bcd-2d3bda1825ef",
    created_at: "2024-10-10T09:30:22.000Z",
    updated_at: "2024-10-10T10:45:12.000Z",
    employee: {
      id: "ac7d6821-3a48-4918-8b5f-7485e5ed0c78",
      created_at: "2023-11-05T13:40:10.000Z",
      updated_at: "2024-09-29T12:05:45.000Z",
      name: "Michael Davis",
      user: {
        id: "u34567cdef",
        last_login: null,
        email: "michael.davis@example.com",
        is_active: true,
        is_staff: false,
        role: UserRoleEnum.PROJECT,
        groups: [],
        user_permissions: [],
        refresh: "refresh-token",
        access: "access-token",
      },
    },
    name: "Add New Product to Inventory",
    description:
      "Add new products to the system with complete details, including SKU, category, and initial stock levels.",
    status: TaskStatusEnum.DONE,
  },
  {
    id: "12d6a791-9e9a-4b9b-9e82-8d2b8e1bdb7f",
    created_at: "2024-10-13T14:12:30.000Z",
    updated_at: "2024-10-13T15:05:12.000Z",
    employee: {
      id: "d47f681c-4a7b-482d-9f6e-8f2d2a2d1b9b",
      created_at: "2024-02-01T12:30:55.000Z",
      updated_at: "2024-09-30T13:20:15.000Z",
      name: "Emily White",
      user: {
        id: "u45678defg",
        last_login: null,
        email: "emily.white@example.com",
        is_active: true,
        is_staff: false,
        role: UserRoleEnum.WAREHOUSE,
        groups: [],
        user_permissions: [],
        refresh: "refresh-token",
        access: "access-token",
      },
    },
    name: "Organize Warehouse for Efficiency",
    description:
      "Reorganize the warehouse layout to optimize efficiency and streamline the picking process.",
    status: TaskStatusEnum.IN_PROGRESS,
  },
  {
    id: "e89f7925-8a2d-4cb9-a5e3-b2db8f4ebc3a",
    created_at: "2024-10-15T12:22:12.000Z",
    updated_at: "2024-10-15T12:45:30.000Z",
    employee: {
      id: "f1b9d782-4f6b-4c8b-9d2e-8b2e8c2d9f6a",
      created_at: "2023-10-10T09:50:55.000Z",
      updated_at: "2024-10-10T14:10:12.000Z",
      name: "Laura Green",
      user: {
        id: "u56789efgh",
        last_login: null,
        email: "laura.green@example.com",
        is_active: true,
        is_staff: false,
        role: UserRoleEnum.LOGISTICS,
        groups: [],
        user_permissions: [],
        refresh: "refresh-token",
        access: "access-token",
      },
    },
    name: "Coordinate Product Dispatch",
    description:
      "Plan and oversee the dispatch of products to regional distribution centers.",
    status: TaskStatusEnum.TODO,
  },
  {
    id: "2d5a6f34-9f9e-4b7b-9b6e-2d8a1f6c7d3a",
    created_at: "2024-10-16T09:12:12.000Z",
    updated_at: "2024-10-16T10:10:30.000Z",
    employee: {
      id: "d2e9a681-2f7b-4e3d-8b1c-9b2d6e8f9d1a",
      created_at: "2023-09-15T12:50:15.000Z",
      updated_at: "2024-09-20T11:45:22.000Z",
      name: "Oliver Stone",
      user: {
        id: "u67890fghi",
        last_login: null,
        email: "oliver.stone@example.com",
        is_active: true,
        is_staff: false,
        role: UserRoleEnum.PROJECT,
        groups: [],
        user_permissions: [],
        refresh: "refresh-token",
        access: "access-token",
      },
    },
    name: "Review Supplier Performance",
    description:
      "Assess the performance of suppliers and adjust stock orders based on delivery times and product quality.",
    status: TaskStatusEnum.IN_PROGRESS,
  },
];

export {
  brands,
  categories,
  types,
  products,
  users,
  distributions,
  inventoryTasks,
};
