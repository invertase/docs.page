import { Error } from "~/layouts/Error";

export default function NotFound() {
  return (
    <Error
      title="Not Found"
      description="The page you were looking for could not be found."
    />
  );
}
