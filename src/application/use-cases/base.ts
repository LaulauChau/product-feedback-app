export type BaseUseCase<TInput, TOutput> = {
  execute(input: TInput): TOutput;
};
