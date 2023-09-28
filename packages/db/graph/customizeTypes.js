import { schemaComposer } from 'graphql-compose'

/**
 * Customizes an object type in the schema using a customization function.
 * @param {string} typeName - The name of the object type to customize.
 * @param {Function} customizeFn - A function that takes in the object type composer and customizes it.
 */
export function customizeTypes(typeName, customizeFn) {
  // Get the object type composer for the given type name.
  const type = schemaComposer.getOTC(typeName)

  // If the type exists, customize it with the given function.
  if (type) {
    customizeFn(type)
  }
}
