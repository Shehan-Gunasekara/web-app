export const dashboardMetrics = {
  menu: "Menu",
  category: "Category",
  item: "Item",
};

export const modifierOptions = {
  required: {
    value: "required",
    label: "Required",
    description:
      "Customers must make (Choice Limit) selections from the available options",
    text: "Customers must make (Choice Limit) selections from the available options, for example sizes(1) or toppings(3).\
          The price of the selections will be added to / subtracted from the total price of the order\
          (e.g. Item: Pizza($10). Required: Small($-5), Medium(0), Large($+5)).",
  },
  optional: {
    value: "optional",
    label: "Optional",
    description:
      "Customers can add (0 - Choice Limit) optional extras (e.g: toppings, removals)",
    text: "Customers can add (0 - Choice Limit) optional/extras when adding an item to their order (e.g. Add Bacon($2), Meatless(-$3.50)).\
    The price of the selections will be added to / subtracted from the total price of the order.",
  },
};
