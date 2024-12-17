import { FC, memo, useCallback } from "react";
import LinkTabs from "../../Components/LinkTabs/LinkTabs";
import { ILinkTab } from "../../Components/LinkTabs/LinkTabsInterface";
import InpatientTabCareTeam from "./InpatientManageTabCareTeam";
import InpatientManageTabClaimForm from "./InpatientManageTabClaimForm";
import InpatientTabDietOrder from "./InpatientManageTabDietOrder";
import InpatientTabDoctorOrder from "./InpatientManageTabDoctorOrder";
import InpatientTabHistory from "./InpatientManageTabHistory";
import InpatientTabLabResult from "./InpatientManageTabLabResult";
import InpatientTabProc from "./InpatientManageTabProcedure";

interface InpatientManageTabProps {
  patno: string;
  handleSetActiveTab: (tab: number) => void;
}

const InpatientManageTab: FC<InpatientManageTabProps> = memo(({ patno, handleSetActiveTab }) => {
  const GenerateTabLinks = useCallback(() => {
    let LinkTabRoutes: Array<ILinkTab> = [];

    LinkTabRoutes = [
      {
        label: "Claim Form 4",
        link: `/inpatients/${patno}/summary`,
        Component: <InpatientManageTabClaimForm patno={patno} />,
      },
      // {
      //   label: "Medications",
      //   link: `/inpatients/${patno}/medication`,
      //   Component: <InpatientTabMed patno={patno} />,
      // },
      {
        label: "Procedures",
        link: `/inpatients/${patno}/procedure`,
        Component: <InpatientTabProc patno={patno} />,
      },
      {
        label: "Documents",
        link: `/inpatients/${patno}/lab-results`,
        Component: <InpatientTabLabResult patno={patno} />,
      },
      {
        label: "Care Team",
        link: `/inpatients/${patno}/care-team`,
        Component: <InpatientTabCareTeam patno={patno} />,
      },
      {
        label: "Diet Orders",
        link: `/inpatients/${patno}/diet-orders`,
        Component: <InpatientTabDietOrder patno={patno} />,
      },
      // {
      //   label: "Ward Courses",
      //   link: `/inpatients/${patno}/ward-courses`,
      //   Component: <InpatientTabWardCourse patno={patno} />,
      // },
      {
        label: "Doctor Order",
        link: `/inpatients/${patno}/doctor-order`,
        Component: <InpatientTabDoctorOrder patno={patno} />,
      },
      {
        label: "Admission History",
        link: `/inpatients/${patno}/history`,
        Component: <InpatientTabHistory patno={patno} />,
      },
    ];

    return LinkTabRoutes;
  }, [patno]);

  return (
    <>
      {/* <LinkTabs tabs={GenerateTabLinks()} minHeight={430} maxHeight={600} /> */}
      <LinkTabs tabs={GenerateTabLinks()} handleSetActiveTab={handleSetActiveTab} />
    </>
  );
});

export default InpatientManageTab;
