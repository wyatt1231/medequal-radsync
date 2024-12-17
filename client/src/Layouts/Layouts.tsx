import React, { FC, memo } from "react";
import BodyLayout from "./BodyLayout/BodyLayout";
import SidebarLayout from "./SidebarLayout/SidebarLayout";
import TopbarLayout from "./TopbarLayout/TopbarLayout";

interface LayoutsProps {}

const Layouts: FC<LayoutsProps> = memo(({ children }) => {
  // const loggedin_user = useSelector(
  //   (store: RootStore) => store.UserReducer.loggedin_user
  // );

  return (
    <>
      <TopbarLayout />
      <SidebarLayout />
      <BodyLayout>{children}</BodyLayout>
      {/* <FooterLayout /> */}
    </>
  );
});

export default Layouts;
