import React, { useCallback, useEffect } from "react";
import Search from "../components/Search";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Select,
  MenuItem,
  FormControl,
  Button,
  Box,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import {
  MEAL_PROGRAM_CATEGORY_ID,
  FOOD_PANTRY_CATEGORY_ID,
  DEFAULT_CATEGORIES,
} from "../constants/stakeholder";
import SwitchViewsButton from "./SwitchViewsButton";

const useStyles = makeStyles((theme) => ({
  filterGroup: {
    margin: 0,
    padding: 0,
  },
  filterGroupButton: {
    margin: 0,
    padding: ".5rem",
    fontSize: "max(.8vw,12px)",
    whiteSpace: "nowrap",
    backgroundColor: "#fff",
    border: ".1em solid #000",
    color: "#000",
    [theme.breakpoints.down("xs")]: {
      padding: ".1rem .1rem",
      margin: "0",
      fontSize: "max(.8vw,11px)",
    },
  },
  filterButton: {
    margin: 0,
    padding: ".5rem",
    fontSize: "max(.8vw,12px)",
    whiteSpace: "nowrap",
    backgroundColor: "#fff",
    border: ".1em solid #000",
    color: "#000",
    [theme.breakpoints.down("xs")]: {
      padding: ".6rem .6rem",
      margin: ".3rem",
      fontSize: "max(.8vw,12px)",
      borderRadius: "5px !important",
    },
  },
  distanceControl: {
    margin: ".3rem",
    backgroundColor: "#fff",
    // padding: "auto 0 auto .7em",
    padding: ".3rem",
    border: ".1em solid #000",
    outline: "none",
    [theme.breakpoints.down("xs")]: {
      padding: ".4rem",
      margin: ".3rem",
    },
  },
  menuItems: {
    fontSize: "max(.8vw,12px)",
    color: "#000",
  },
  controlPanel: {
    backgroundColor: "#336699",
    padding: "1rem 0",
    flex: "1 0 auto",
  },
  inputHolder: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  input: {
    fontSize: "12px",
    width: "25em",
    height: "2em",
    outline: "none",
    padding: ".25em",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    width: 32,
    height: 32,
  },
  submit: {
    height: "40px",
    minWidth: "25px",
    backgroundColor: "#BCE76D",
    borderRadius: "0 6px 6px 0",
    boxShadow: "none",
    "& .MuiButton-startIcon": {
      marginRight: 0,
    },
    "&.Mui-disabled": {
      backgroundColor: "#BCE76D",
      opacity: 0.8,
    },
    "&:hover": {
      backgroundColor: "#C7F573",
      boxShadow: "none",
    },
    [theme.breakpoints.down("xs")]: {
      marginRight: ".5rem",
    },
  },
  buttonHolder: {
    display: "flex",
    [theme.breakpoints.down("xs")]: {
      marginTop: "1rem",
    },
  },
}));

const distanceInfo = [0, 1, 2, 3, 5, 10, 20, 50, 100, 500];

const ResultsFilters = ({
  search,
  isWindowWide,
  viewport,
  setViewport,
  setIsPopupOpen,
  doSelectStakeholder,
  origin,
  setOrigin,
  radius,
  setRadius,
  isVerifiedSelected,
  selectVerified,
  userCoordinates,
  categoryIds,
  toggleCategory,
  viewPortHash,
  isMobile,
  isMapView,
  switchResultsView,
}) => {
  const classes = useStyles();

  const isMealsSelected = categoryIds.indexOf(MEAL_PROGRAM_CATEGORY_ID) >= 0;
  const isPantrySelected = categoryIds.indexOf(FOOD_PANTRY_CATEGORY_ID) >= 0;

  const doHandleSearch = useCallback(
    (e) => {
      if (e) {
        e.preventDefault();
      }
      const storage = window.sessionStorage;
      search({
        latitude:
          origin.latitude ||
          userCoordinates.latitude ||
          JSON.parse(storage.origin).latitude,
        longitude:
          origin.longitude ||
          userCoordinates.longitude ||
          JSON.parse(storage.origin).longitude,
        radius,
        categoryIds: categoryIds.length ? categoryIds : DEFAULT_CATEGORIES,
        isInactive: "either",
        verificationStatusId: 0,
      });
      if (origin.locationName && origin.latitude && origin.longitude)
        storage.origin = JSON.stringify({
          locationName: origin.locationName,
          latitude: origin.latitude,
          longitude: origin.longitude,
        });

      storage.categoryIds = JSON.stringify(categoryIds);
      storage.radius = JSON.stringify(radius);
      storage.verified = JSON.stringify(isVerifiedSelected);
      setViewport({
        zoom: viewPortHash[radius],
        latitude: origin.latitude,
        longitude: origin.longitude,
      });
      setIsPopupOpen(false);
      doSelectStakeholder(null);
    },
    [
      search,
      origin.locationName,
      origin.latitude,
      origin.longitude,
      userCoordinates.latitude,
      userCoordinates.longitude,
      radius,
      categoryIds,
      isVerifiedSelected,
      setViewport,
      setIsPopupOpen,
      doSelectStakeholder,
      viewPortHash,
    ]
  );

  const toggleMeal = useCallback(() => {
    toggleCategory(MEAL_PROGRAM_CATEGORY_ID);
  }, [toggleCategory]);

  const togglePantry = useCallback(() => {
    toggleCategory(FOOD_PANTRY_CATEGORY_ID);
  }, [toggleCategory]);

  useEffect(() => {
    doHandleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radius, categoryIds, isVerifiedSelected, toggleCategory]);

  const handleDistanceChange = (distance) => {
    setRadius(distance);
    setViewport({
      ...viewport,
      zoom: viewPortHash[distance],
    });
  };

  return (
    <Grid
      item
      container
      wrap="wrap-reverse"
      className={classes.controlPanel}
      style={{
        justifyContent: isWindowWide ? null : "center",
      }}
    >
      <Grid
        item
        container
        xs={12}
        sm={6}
        md={4}
        justify="center"
        alignItems="center"
        className={classes.buttonHolder}
      >
        <Grid item>
          <Button as={FormControl} className={classes.distanceControl}>
            <Select
              name="select-distance"
              disableUnderline
              value={radius}
              onChange={(e) => handleDistanceChange(e.target.value)}
              inputProps={{
                name: "select-distance",
                id: "select-distance",
              }}
              className={classes.menuItems}
            >
              <MenuItem key={0} value={0} className={classes.menuItems}>
                DISTANCE
              </MenuItem>
              {distanceInfo.map((distance) => (
                <MenuItem
                  key={distance}
                  value={distance}
                  className={classes.menuItems}
                >
                  {distance === 0
                    ? "(Any)"
                    : `${distance} MILE${distance > 1 ? "S" : ""}`}
                </MenuItem>
              ))}
            </Select>
          </Button>
        </Grid>
        <Grid item>
          <Button
            className={classes.filterButton}
            style={{
              backgroundColor: isPantrySelected ? "#0A3865" : "#fff",
              color: isPantrySelected ? "#fff" : "#000",
              marginLeft: "0.25rem",
              borderRadius: "5px 0 0 5px",
            }}
            onClick={togglePantry}
          >
            <svg
              width="20"
              height="22"
              viewBox="0 0 20 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.14735 19.2264C7.70202 19.7216 6.83277 19.9998 6.0858 19.9998C3.51778 19.9998 0 15.4426 0 11.3827C0 7.32277 1.67125 4.44393 4.23927 4.44393C5.63232 4.44393 6.75634 4.6131 7.35656 5.32542L7.34535 5.28058C7.34535 5.28058 6.88168 3.29648 6.12351 2.87968C6.54234 2.65549 7.31784 2.02673 7.31784 2.02673C7.31784 2.02673 8.51217 3.65213 8.51217 5.28262V5.32542C9.39467 4.54788 10.4494 4.06688 12.0544 4.06688C14.6224 4.06688 16.2947 7.32277 16.2947 11.3827C16.2947 15.4426 12.6516 19.9998 10.0836 19.9998C9.33047 19.9998 8.59472 19.7308 8.14735 19.2264Z"
                fill={isPantrySelected ? "#fff" : "#000"}
              />
              <path
                d="M11.3528 2.62203C10.668 3.75216 9.16287 4.09151 9.16287 4.09151C9.16287 4.09151 8.76748 2.59961 9.45229 1.4705C10.1371 0.341384 11.6412 0 11.6412 0C11.6412 0 12.0366 1.4919 11.3528 2.62203Z"
                fill={isPantrySelected ? "#fff" : "#000"}
              />
            </svg>
            Pantries
          </Button>
        </Grid>
        <Grid item>
          <Button
            className={classes.filterButton}
            style={{
              backgroundColor: isMealsSelected ? "#0A3865" : "#fff",
              color: isMealsSelected ? "#fff" : "#000",
              marginRight: "0.25rem",
              borderRadius: "0 5px 5px 0",
            }}
            onClick={toggleMeal}
          >
            <svg
              width="9"
              height="22"
              margin="5"
              viewBox="0 0 9 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.84393 0C6.33198 0 6.42729 0.582211 6.42729 0.582211C6.42729 1.89018 6.42729 4.71511 6.42729 6.03915C6.42729 7.72951 4.67836 8.12225 4.67836 8.12225V20.9114C4.67836 20.9114 4.66343 22 3.50475 22C2.34607 22 4.04103 22 2.91565 22C1.79027 22 1.7696 20.9114 1.7696 20.9114V8.12225C1.7696 8.12225 0 7.741 0 6.04489V0.556947C0 0.556947 0.0137804 0 0.58336 0C1.15294 0 1.16212 0.0195218 1.16212 0.556947C1.16212 1.09437 1.1805 4.49347 1.1805 4.49347C1.1805 4.49347 1.22069 5.01253 1.48596 5.01253C1.75123 5.01253 1.73056 4.49347 1.73056 4.49347C1.73056 4.49347 1.73056 1.11389 1.73056 0.556947C1.73056 -5.47574e-08 1.73745 0 2.32081 0C2.90417 0 2.93058 0.0195218 2.93058 0.556947C2.93058 1.09437 2.93058 4.55089 2.93058 4.55089C2.93058 4.55089 2.95125 5.05042 3.21537 5.05042C3.47949 5.05042 3.5059 4.513 3.5059 4.513C3.5059 4.513 3.5059 1.08863 3.5059 0.544316C3.5059 0 3.6081 0 4.13749 0C4.66688 0 4.70018 0.0321537 4.70018 0.531684C4.70018 1.03121 4.70018 4.44639 4.70018 4.44639C4.70018 4.44639 4.67951 5.06994 4.9643 5.06994C5.25942 5.06994 5.27665 4.48084 5.27665 4.48084C5.27665 4.48084 5.28124 1.13916 5.28124 0.569579C5.28124 0 5.35588 0 5.84393 0Z"
                fill={isMealsSelected ? "#fff" : "#000"}
              />
            </svg>
            Meals
          </Button>
        </Grid>
        <Grid item>
          {isMobile && (
            <SwitchViewsButton
              isMapView={isMapView}
              onClick={switchResultsView}
              color="white"
            />
          )}
          {/* <Button
            className={classes.filterGroupButton}
            style={{
              backgroundColor: isVerifiedSelected ? "#0A3865" : "#fff",
              color: isVerifiedSelected ? "#fff" : "#000",
            }}
            onClick={() => {
              selectVerified(!isVerifiedSelected);
            }}
          >
            Updated Data
          </Button> */}
        </Grid>
      </Grid>
      <Box
        className={classes.inputContainer}
        style={{ width: isWindowWide ? "30rem" : "100%" }}
      >
        <form
          noValidate
          onSubmit={(e) => doHandleSearch(e)}
          style={{ all: "inherit" }}
        >
          <Search
            userCoordinates={userCoordinates}
            setOrigin={setOrigin}
            origin={origin}
          />
          <Button
            type="submit"
            disabled={!origin}
            variant="contained"
            className={classes.submit}
            startIcon={
              <SearchIcon fontSize="large" className={classes.searchIcon} />
            }
          />
        </form>
      </Box>
    </Grid>
  );
};

ResultsFilters.propTypes = {
  distance: PropTypes.number,
  placeName: PropTypes.string,
  isPantryCategorySelected: PropTypes.bool,
  isMealCategorySelected: PropTypes.bool,
  isVerifiedFilterSelected: PropTypes.bool,
  search: PropTypes.func,
};

export default ResultsFilters;
