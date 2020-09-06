
PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS sets;

CREATE TABLE sets (
  set_num VARCHAR(20) PRIMARY KEY NOT NULL,
  name VARCHAR(256) NOT NULL,
  year INTEGER NOT NULL,
  theme_id INTEGER,
  num_parts INTEGER,
  FOREIGN KEY (theme_id) REFERENCES themes (id)
);

DROP TABLE IF EXISTS themes;

CREATE TABLE themes (
  id INTEGER PRIMARY KEY NOT NULL,
  name VARCHAR(16) NOT NULL,
  parent_id INTEGER
);

DROP TABLE IF EXISTS inventory_sets;

CREATE TABLE inventory_sets (
  inventory_id INTEGER NOT NULL,
  set_num VARCHAR(20) NOT NULL,
  quantity INTEGER,
  FOREIGN KEY (inventory_id) REFERENCES inventories (id),
  FOREIGN KEY (set_num) REFERENCES sets (set_num)
);

DROP TABLE IF EXISTS inventories;

CREATE TABLE inventories (
  id INTEGER PRIMARY KEY NOT NULL,
  version INTEGER,
  set_num VARCHAR(20),
  FOREIGN KEY (set_num) REFERENCES sets (set_num)
);

DROP TABLE IF EXISTS colors;

CREATE TABLE colors (
  id INTEGER PRIMARY KEY NOT NULL,
  name VARCHAR(16) NOT NULL,
  rgb VARCHAR(16) NOT NULL,
  is_trans VARCHAR(16)
);

DROP TABLE IF EXISTS inventory_parts;

CREATE TABLE inventory_parts (
  -- id INTEGER PRIMARY KEY NOT NULL,
  inventory_id INTEGER NOT NULL,
  part_num VARCHAR(20) NOT NULL,
  color_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  is_spare VARCHAR(1),
  FOREIGN KEY (inventory_id) REFERENCES inventories (id),
  FOREIGN KEY (part_num) REFERENCES parts (part_num),
  FOREIGN KEY (color_id) REFERENCES colors (id)
);

DROP TABLE IF EXISTS part_categories;

CREATE TABLE part_categories (
  id INTEGER PRIMARY KEY NOT NULL,
  name VARCHAR(16) NOT NULL
);

DROP TABLE IF EXISTS parts;

CREATE TABLE parts (
  part_num VARCHAR(20) PRIMARY KEY NOT NULL,
  name VARCHAR(250) NOT NULL,
  part_cat_id INTEGER,
  part_material_id VARCHAR(16),
  FOREIGN KEY (part_cat_id) REFERENCES part_categories (id)
);

DROP TABLE IF EXISTS part_relationships;

CREATE TABLE part_relationships (
  rel_type VARCHAR(16),
  child_part_num VARCHAR(16),
  parent_part_num VARCHAR(16)
);

DROP TABLE IF EXISTS elements;

CREATE TABLE elements (
  element_id VARCHAR(10) PRIMARY KEY NOT NULL,
  part_num VARCHAR(20) NOT NULL,
  color_id INTEGER NOT NULL,
  FOREIGN KEY (part_num) REFERENCES parts (part_num),
  FOREIGN KEY (color_id) REFERENCES colors (id)
);

DROP TABLE IF EXISTS minifigs;

CREATE TABLE minifigs (
  fig_num VARCHAR(20) PRIMARY KEY NOT NULL,
  name VARCHAR(256),
  num_parts INTEGER
);

DROP TABLE IF EXISTS inventory_minifigs;

CREATE TABLE inventory_minifigs (
  inventory_id INTEGER NOT NULL,
  fig_num VARCHAR(20),
  quantity INTEGER,
  FOREIGN KEY (inventory_id) REFERENCES inventories (id),
  FOREIGN KEY (fig_num) REFERENCES minifigs (fig_num)
);
