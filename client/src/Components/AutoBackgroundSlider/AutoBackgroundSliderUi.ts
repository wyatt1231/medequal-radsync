import styled from "styled-components";

export const AutoBackgroundSliderUi = styled.div`
  display: grid;
  grid-template-areas: "slides";
  height: 100%;
  width: 100%;
`;

export const AutoBackgroundSlideUi = styled.div<{ src: any }>`
  grid-area: slides;
  height: 100%;
  width: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4)),
    url("${(p: any) => p?.src?.default}") no-repeat center center;
  opacity: 0;
  background-size: cover;
  margin-left: 0;

  transition: 2s opacity cubic-bezier(0.95, 0.05, 0.795, 0.035);
  -webkit-transition: 2s opacity cubic-bezier(0.95, 0.05, 0.795, 0.035);
  -moz-transition: 2s opacity cubic-bezier(0.95, 0.05, 0.795, 0.035);
  -o-transition: 2s opacity cubic-bezier(0.95, 0.05, 0.795, 0.035);
  &.active {
    opacity: 1 !important;
  }
`;
