#!/usr/bin/env node
// scripts/validate-models.mjs
import fs from "fs";
import path from "path";
import Ajv from "ajv";

const root = process.cwd();
const schemaPath = path.join(root, "src", "models", "models.schema.json");
const modelsPath = path.join(root, "public", "models.json"); // adjust if moved

if (!fs.existsSync(schemaPath)) {
  console.error("[validate-models] Missing schema:", schemaPath);
  process.exit(1);
}
if (!fs.existsSync(modelsPath)) {
  console.error("[validate-models] Missing models.json:", modelsPath);
  process.exit(1);
}

const schema = JSON.parse(fs.readFileSync(schemaPath,'utf8'));
const data = JSON.parse(fs.readFileSync(modelsPath,'utf8'));

const ajv = new Ajv({ allErrors:true });
const validate = ajv.compile(schema);
const valid = validate(data);

if (!valid) {
  console.error("[validate-models] Schema validation failed:");
  console.error(validate.errors);
  process.exit(2);
}
console.log("[validate-models] OK - models.json conforms to schema.");
