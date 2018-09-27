import { SchemaDirectiveVisitor } from "graphql-tools";
import { defaultFieldResolver } from "graphql";
import { AuthenticationError } from "apollo-server-errors";

export default class AuthDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    this.ensureFieldsWrapped(type, this.args.requires);
  }
  // Visitor methods for nested types like fields and arguments
  // also receive a details object that provides information about
  // the parent and grandparent types.
  visitFieldDefinition(field, details) {
    this.secureField(field, this.args.requires);
  }

  ensureFieldsWrapped(objectType, authRoles?: any[]) {
    const fields = objectType.getFields();
    Object.keys(fields).forEach(fieldName => {
      this.secureField(fields[fieldName], authRoles);
    });
  }

  secureField(field, authRoles?: any[]) {
    const { resolve = defaultFieldResolver } = field;
    if (field._wrap) return;
    field._wrap = true; //avoid wrapping field twice
    field.resolve = async function(...args) {
      const context = args[2];
      if (!context.token) throw new AuthenticationError("errors.unauthorized");
      if (!authRoles) {
        return resolve.apply(this, args);
      }
      return resolve.apply(this, args);
    };
  }
}
