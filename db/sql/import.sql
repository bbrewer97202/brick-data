.mode csv
.import '| tail -n +2 ./db/src/inventories.csv' inventories
.import '| tail -n +2 ./db/src/themes.csv' themes
.import '| tail -n +2 ./db/src/colors.csv' colors
.import '| tail -n +2 ./db/src/part_categories.csv' part_categories
.import '| tail -n +2 ./db/src/sets.csv' sets
.import '| tail -n +2 ./db/src/parts.csv' parts
.import '| tail -n +2 ./db/src/elements.csv' elements
.import '| tail -n +2 ./db/src/minifigs.csv' minifigs
.import '| tail -n +2 ./db/src/part_relationships.csv' part_relationships
.import '| tail -n +2 ./db/src/inventory_sets.csv' inventory_sets
.import '| tail -n +2 ./db/src/inventory_parts.csv' inventory_parts
.import '| tail -n +2 ./db/src/inventory_minifigs.csv' inventory_minifigs


