import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { LANDING_PAGE, NEW_USER_WELCOME_URL } from "../config/ScreenRoutes";
import { Query } from "../graphql/generated_graphql_types";
import { GET_CURRENT_USER } from "../graphql/queries/getCurrentUser";
import { ErrorScreen } from "../Screens/ErrorScreen";

export const withAuth = (WrappedComponent: any): React.FC<any> => {
  // eslint-disable-next-line react/display-name
  return () => {
    const { loading, error, data } = useQuery<Query>(GET_CURRENT_USER);
    const router = useRouter();

    if (loading) {
      return null;
    } else if (error) {
      return <ErrorScreen message={error.message} />;
    } else {
      if (data?.getCurrentUser) {
        // user logged in
        return <WrappedComponent />;
      } else {
        router.push(LANDING_PAGE);
      }
      return null;
    }
  };
};
