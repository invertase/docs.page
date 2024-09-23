import { Error } from "~/layouts/Error";

export default function ServerError() {
  return (
    <Error
      title="Something went wrong"
      description="An unexpected error occurred. Please try again later."
    />
  );
}
