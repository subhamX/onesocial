import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Loading } from "../../components/Commons/Loading";
import { USER_WALL_SCREEN } from "../../config/ScreenRoutes";
import { Query } from "../../graphql/generated_graphql_types";
import { GET_CURRENT_USER } from "../../graphql/queries/getCurrentUser";
import { ErrorScreen } from "../../Screens/ErrorScreen";
import { getErrorMessageFromApolloError } from "../../utils/getErrorMessageFromApolloError";

const MyProfileProxy = () => {
  // fetch user data
  const { data, loading, error } = useQuery<{
    getCurrentUser: Query["getCurrentUser"];
  }>(GET_CURRENT_USER, {
    fetchPolicy: "cache-first",
  });
  const router = useRouter();

  if (loading) {
    return <Loading text="Loading..." />;
  } else if (data?.getCurrentUser) {
    router.push(USER_WALL_SCREEN(data.getCurrentUser.id));
  } else if (error) {
    return <ErrorScreen message={getErrorMessageFromApolloError(error)} />;
  } else {
    toast("Please login to view your profile.", { type: "error" });
    // user not logged in
    router.push("/");
  }
};

export default MyProfileProxy;
