const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const connectDB = require("./components/config/db");
const { SALT } = require("./components/config/config");
const Category = require("./components/models/categoryModel");
const Product = require("./components/models/productModel");
const Supplier = require("./components/models/supplierModel");
const User = require("./components/models/userModel");

const categories = [
  { name: "Bags", description: "Totes and carry-alls for books and daily campus essentials." },
  { name: "Stationery", description: "Notebooks, notes, and writing supplies for class." },
  { name: "Drinkware", description: "Tumblers and bottles for long school days." },
  { name: "Tech", description: "Gadgets and devices for studying and dorm life." },
  { name: "Apparel", description: "Hoodies and everyday campus wear." },
  { name: "Workspace", description: "Organizers and tools for a tidy study desk." },
  { name: "Accessories", description: "Lanyards, ID holders, and other small daily items." },
  { name: "Bundles", description: "Ready-to-grab kits and care packs for students." },
];

const suppliers = [
  { name: "Bulldog Threads", email: "sales@bulldogthreads.example", phone: "0917 555 0101" },
  { name: "Campus Paper Co.", email: "orders@campuspaper.example", phone: "0918 555 0102" },
  { name: "Everyday Gear PH", email: "hello@everydaygear.example", phone: "0919 555 0103" },
  { name: "BrightDesk Electronics", email: "support@brightdesk.example", phone: "0920 555 0104" },
];

const products = [
  {
    name: "campus-tote-bag",
    title: "Campus Tote Bag",
    category: "Bags",
    supplier: "Everyday Gear PH",
    price: 499,
    stock: "In stock",
    content: [
      "A roomy everyday tote for books, gym clothes, chargers, and quick campus errands.",
      "Made with thick canvas, reinforced handles, and a clean monochrome print.",
      "Best for students who want one simple carry-all bag for class and after-class plans.",
    ],
    image: "totebag.png",
  },
  {
    name: "daily-notes-pack",
    title: "Daily Notes Pack",
    category: "Stationery",
    supplier: "Campus Paper Co.",
    price: 249,
    stock: "In stock",
    content: [
      "A practical bundle of notebooks, sticky notes, and quick-label tabs for daily class work.",
      "The set is light, compact, and easy to keep inside a backpack or locker.",
      "Useful for lectures, reminders, project lists, and exam review schedules.",
    ],
    image: "notebook.png",
  },
  {
    name: "stainless-tumbler",
    title: "Stainless Tumbler",
    category: "Drinkware",
    supplier: "Everyday Gear PH",
    price: 599,
    stock: "Low stock",
    content: [
      "A double-wall tumbler built for water, coffee, or tea during long school days.",
      "The matte finish keeps the look simple while the lid helps reduce spills in your bag.",
      "Fits most side pockets and keeps drinks ready between classes.",
    ],
    image: "tumbler.png",
  },
  {
    name: "wireless-study-lamp",
    title: "Wireless Study Lamp",
    category: "Tech",
    supplier: "BrightDesk Electronics",
    price: 899,
    stock: "In stock",
    content: [
      "A compact rechargeable lamp for dorm desks, night study sessions, and small workspaces.",
      "It has three brightness levels and a foldable body that stores neatly after use.",
      "Good for reading, writing, and focused desk work without taking too much space.",
    ],
    image: "lamp.png",
  },
  {
    name: "hoodie-jacket",
    title: "Hoodie Jacket",
    category: "Apparel",
    supplier: "Bulldog Threads",
    price: 1199,
    stock: "Preorder",
    content: [
      "A soft everyday hoodie with a relaxed fit for classrooms, commute days, and weekends.",
      "The heavy cotton blend keeps structure while staying comfortable for regular wear.",
      "Available through preorder so sizes can be reserved before release.",
    ],
    image: "hoddie.png",
  },
  {
    name: "desk-organizer-kit",
    title: "Desk Organizer Kit",
    category: "Workspace",
    supplier: "Campus Paper Co.",
    price: 349,
    stock: "In stock",
    content: [
      "A small organizer set for pens, clips, cables, cards, and other desk essentials.",
      "The modular pieces can be arranged based on your study area or dorm table.",
      "Keeps daily tools visible without adding clutter.",
    ],
    image: "organizer.png",
  },
  {
    name: "id-lanyard-set",
    title: "ID Lanyard Set",
    category: "Accessories",
    supplier: "Everyday Gear PH",
    price: 179,
    stock: "In stock",
    content: [
      "A durable lanyard and card holder set for IDs, access cards, and small passes.",
      "The clip is easy to detach when scanning or presenting credentials.",
      "Simple enough for daily use and sturdy enough for a full semester.",
    ],
    image: "lanyard.png",
  },
  {
    name: "exam-week-care-pack",
    title: "Exam Week Care Pack",
    category: "Bundles",
    supplier: "Campus Paper Co.",
    price: 399,
    stock: "In stock",
    content: [
      "A compact bundle with snacks, tabs, pens, and quick notes for busy review weeks.",
      "Packed for convenience so students can grab one kit and focus on studying.",
      "Ideal as a personal prep item or a small gift for classmates.",
    ],
    image: "exampack.png",
  },
];

const seed = async () => {
  await connectDB();

  // Upsert by name so running the seed again does not delete or duplicate other data
  const categoryIds = {};
  for (const category of categories) {
    const saved = await Category.findOneAndUpdate({ name: category.name }, category, {
      upsert: true,
      returnDocument: "after",
      runValidators: true,
    });
    categoryIds[category.name] = saved._id;
  }

  const supplierIds = {};
  for (const supplier of suppliers) {
    const saved = await Supplier.findOneAndUpdate({ name: supplier.name }, supplier, {
      upsert: true,
      returnDocument: "after",
      runValidators: true,
    });
    supplierIds[supplier.name] = saved._id;
  }

  for (const product of products) {
    await Product.findOneAndUpdate(
      { name: product.name },
      { ...product, category: categoryIds[product.category], supplier: supplierIds[product.supplier] },
      { upsert: true, runValidators: true }
    );
  }

  // Seed one Admin account so Activity 4's role-protected routes can be tested right away.
  // Sign-up always forces role "Customer" (see userController.signUp), so an Admin has to be
  // created this way instead, the same way a real deployment would seed its first Admin.
  const adminPassword = await bcrypt.hash("Admin123!", SALT);
  await User.findOneAndUpdate(
    { email: "admin@bulldogex.nu.edu.ph" },
    { firstName: "BulldogEx", lastName: "Admin", email: "admin@bulldogex.nu.edu.ph", password: adminPassword, role: "Admin" },
    { upsert: true, runValidators: true }
  );

  // Existing users from before role-based access control was added default to "Customer"
  const backfilled = await User.updateMany({ role: { $exists: false } }, { $set: { role: "Customer" } });

  console.log(`Seeded ${categories.length} categories, ${suppliers.length} suppliers, and ${products.length} products`);
  console.log(`Seeded 1 admin account (admin@bulldogex.nu.edu.ph); backfilled role on ${backfilled.modifiedCount} existing user(s)`);
  await mongoose.disconnect();
};

seed();
