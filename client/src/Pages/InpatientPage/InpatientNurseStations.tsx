import { Badge, Grid, Skeleton, styled, Tabs } from "@mui/material";
import { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AntTab } from "../../Components/LinkTabs/LinkTabs";
import InpatientActions from "../../Contexts/Actions/InpatientActions";
import { RootStore } from "../../Contexts/Store";
import { NurseStationDto } from "../../Interfaces/InpatientInterfaces";
import InpatientNurseStationsUi from "./InpatientNurseStationsUi";

interface InpatientNurseStationsProps {
  setIsLoadingTable: (is_loading: boolean) => void;
}

const InpatientNurseStations: FC<InpatientNurseStationsProps> = memo(
  (props) => {
    const dispatch = useDispatch();

    const [active_tab, set_active_tab] = useState(0);

    const { inpatient_nurse_stations, inpatient_nurse_stations_loading } =
      useSelector((store: RootStore) => store.InpatientReducer);

    const [nurse_stations, set_nurse_stations] =
      useState<Array<NurseStationDto>>();

    const handleChangeTab = useCallback(
      (event: any, value: number) => {
        if (!!nurse_stations) {
          set_active_tab(value);

          let ns = nurse_stations[value]?.nsunit;

          dispatch(
            InpatientActions.SetInpatients(
              {
                nsunit: ns,
              },
              props.setIsLoadingTable
            )
          );
        }
      },
      [dispatch, nurse_stations]
    );

    useEffect(() => {
      dispatch(InpatientActions.SetNurseStations());
    }, [dispatch]);

    useEffect(() => {
      if (!!inpatient_nurse_stations) {
        let total_inp: number = 0;

        inpatient_nurse_stations.forEach((inp) => {
          total_inp = total_inp + (!!inp.pat_count ? inp.pat_count : 0);
        });

        set_nurse_stations([
          {
            nsunit: "",
            pat_count: total_inp,
          },
          ...inpatient_nurse_stations,
        ]);
      }
    }, [inpatient_nurse_stations]);

    return (
      <InpatientNurseStationsUi>
        {!!nurse_stations && !inpatient_nurse_stations_loading ? (
          <InpAntTabs
            value={active_tab}
            className="tabs"
            indicatorColor="primary"
            textColor="primary"
            style={{
              // boxShadow: `0px 20px 10px -15px rgba(0,0,0,0.1)`,
              // backgroundColor: `#1565c0`,
              borderRadius: 7,
            }}
            variant="scrollable"
            onChange={handleChangeTab}
            allowScrollButtonsMobile={true}
            scrollButtons={"auto"}
          >
            {nurse_stations.map((value, index) => (
              <AntTab
                key={index}
                label={
                  <Badge
                    badgeContent={!!value.pat_count ? value.pat_count : "0"}
                    color="secondary"
                    overlap="circular"
                    max={1000}
                  >
                    <span
                      style={{
                        padding: `.5em .5em`,
                        // color: `#fff`,
                      }}
                    >
                      {value.nsunit === "" ? "All" : value.nsunit}
                    </span>
                  </Badge>
                }
              />
            ))}
          </InpAntTabs>
        ) : (
          <Grid container columnSpacing={2}>
            <Grid item>
              <Skeleton
                height={50}
                width={50}
                variant="text"
                animation="wave"
              />
            </Grid>
            <Grid item>
              <Skeleton
                height={50}
                width={50}
                variant="text"
                animation="wave"
              />
            </Grid>
            <Grid item>
              <Skeleton
                height={50}
                width={50}
                variant="text"
                animation="wave"
              />
            </Grid>
            <Grid item>
              <Skeleton
                height={50}
                width={50}
                variant="text"
                animation="wave"
              />
            </Grid>
          </Grid>
        )}
      </InpatientNurseStationsUi>
    );
  }
);

export default InpatientNurseStations;

const InpAntTabs = styled(Tabs)({
  borderBottom: "1px solid #e8e8e8",
  "& .MuiTabs-indicator": {
    // backgroundColor: "#1890ff",
    // backgroundColor: "#fff",
  },
});
