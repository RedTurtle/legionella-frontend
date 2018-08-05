import gql from 'graphql-tag';

const reportFragments = {
  reportDetails: gql`
    fragment ReportDetails on Report {
      id
      coldChlorineDioxide
      coldChlorineDioxideAlertLevel
      coldFlowChlorineDioxideAlertLevel
      coldFlowChlorineDioxide
      coldFlowTemperature
      coldFlowTemperatureAlertLevel
      coldFlowUfcl
      coldFlowUfclSamplingSelection {
        id
        value
      }
      coldFlowUfclAlertLevel
      coldTemperature
      coldTemperatureAlertLevel
      coldUfcl
      coldUfclSamplingSelection {
        id
        value
      }
      coldUfclAlertLevel
      coldUfclType {
        id
        value
      }
      coldFlowUfclType {
        id
        value
      }
      hotUfclType {
        id
        value
      }
      hotFlowUfclType {
        id
        value
      }
      hotChlorineDioxide
      hotChlorineDioxideAlertLevel
      hotFlowChlorineDioxide
      hotFlowChlorineDioxideAlertLevel
      hotFlowTemperature
      hotFlowTemperatureAlertLevel
      hotFlowUfcl
      hotFlowUfclSamplingSelection {
        id
        value
      }
      hotFlowUfclAlertLevel
      hotTemperature
      hotTemperatureAlertLevel
      hotUfcl
      hotUfclSamplingSelection {
        id
        value
      }
      hotUfclAlertLevel
      notesActions
      riskLevel {
        value
        description
      }
      samplingDate
      reviewDate
      sampleRange {
        id
        title
        description
        tecnicoBlock
        managerBlock
        finalBlock
        reportsFreeze
      }
      wsp {
        id
        code
      }
    }
  `,
  sampleReportOverlay: gql`
    fragment SampleReportOverlay on AggregatedStructures {
      overlayLegionellaHot {
        ...ReportOverlayFragment
      }
      overlayLegionellaCold {
        ...ReportOverlayFragment
      }
      overlayBioxHot {
        ...ReportOverlayFragment
      }
      overlayBioxCold {
        ...ReportOverlayFragment
      }
      overlayTemps {
        coldTemperature {
          ...ReportOverlayFragment
        }
        coldFlowTemperature {
          ...ReportOverlayFragment
        }
        hotTemperature {
          ...ReportOverlayFragment
        }
        hotFlowTemperature {
          ...ReportOverlayFragment
        }
      }
    }

    fragment StructOverlayFragment on StructOverlay {
      percentage
      wspNum
      rangeLevel
    }

    fragment ReportOverlayFragment on ReportOverlay {
      perfect {
        ...StructOverlayFragment
      }
      good {
        ...StructOverlayFragment
      }
      bad {
        ...StructOverlayFragment
      }
      danger {
        ...StructOverlayFragment
      }
      critical {
        ...StructOverlayFragment
      }
    }
  `,
  reportEdit: gql`
    fragment MutateSampleReport on Report {
      reportId
      sampleRange
      wsp
      samplingDate
      coldUfcl
      coldFlowUfcl
      hotUfcl
      hotFlowUfcl
      notesActions
      afterSamplingStatus
      reviewDate
      coldUfclType
      coldFlowUfclType
      hotUfclType
      hotFlowUfclType
      coldUfclSamplingSelection
      coldFlowUfclSamplingSelection
      hotUfclSamplingSelection
      hotFlowUfclSamplingSelection
      coldTemperature
      coldFlowTemperature
      hotTemperature
      hotFlowTemperature
      coldChlorineDioxide
      coldFlowChlorineDioxide
      hotChlorineDioxide
      hotFlowChlorineDioxide
      clientMutationId
    }
  `,
};

export default reportFragments;
