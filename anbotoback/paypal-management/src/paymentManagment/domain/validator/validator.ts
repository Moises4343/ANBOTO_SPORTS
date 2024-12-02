import { validate } from "class-validator";
import { ValidatableEntity } from "./validatable";

export class Validator<T extends ValidatableEntity> {
  private entity: T;

  constructor(entity: T) {
    this.entity = entity;
  }

  public async validate(): Promise<void> {
    const errors = await validate(this.entity);

    if (errors.length > 0) {
      throw new ValidationException(errors.map((error) => ({
        property: error.property,
        errorMessages: Object.values(error.constraints || {}),
      })));
    }
  }
}

export class ValidationException extends Error {
  public HTTP_STATUS: number;
  public validations: any[];

  constructor(validations: any[]) {
    super("Error de validación");
    this.HTTP_STATUS = 422;
    this.validations = validations;
  }
}
