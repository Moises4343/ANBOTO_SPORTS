export interface ValidatableEntity {
    validate: () => Promise<void>;
}