// ** React Imports
import { Fragment } from 'react'

// ** Store
import { useSelector } from 'react-redux'

// ** Custom Components
import Spinner from '@components/spinner/Simple-spinner'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'

// ** Reactstrap Imports
import {
    Col,
    Row
} from 'reactstrap'

// ** Icons Imports
import {
    X,
    Check,
    Voicemail
} from 'react-feather'


// ** Utils
import {
    isObjEmpty
} from '@utils'

// ** Placetel Call List Component
import Table from './Table'

// ** Translation
import { T } from '@localization'

const PlacetelCallList = () => {
    // ** Store vars
    const store = useSelector((state) => state.placetelCall)

    const onPlacetellCallStatsCount = (type = "") => {
        if (store && store.placetelCallStatsCount && !isObjEmpty(store.placetelCallStatsCount)) {
            if (store.placetelCallStatsCount && store.placetelCallStatsCount[type]) {
                return store.placetelCallStatsCount[type] || 0
            }
        }
        return 0
    }

    return (
        <Fragment>
            {/* Placetel Call Stats Data */}
            <Row>
                <Col lg={3} sm={6}>
                    <StatsHorizontal
                        color={"success"}
                        statTitle={T("Received calls")}
                        icon={<Check size={20} />}
                        renderStats={
                            <h3 className={`fw-bolder mb-75`}>
                                {store && store.loading ? (
                                    onPlacetellCallStatsCount("accepted") || 0
                                ) : (
                                    <Spinner className="d-flex" />
                                )}
                            </h3>
                        }
                    />
                </Col>

                <Col lg={3} sm={6}>
                    <StatsHorizontal
                        color={"danger"}
                        statTitle={T("Missed call")}
                        icon={<X size={20} />}
                        renderStats={
                            <h3 className={`fw-bolder mb-75`}>
                                {store && store.loading ? (
                                    onPlacetellCallStatsCount("missed") || 0
                                ) : (
                                    <Spinner className="d-flex" />
                                )}
                            </h3>
                        }
                    />
                </Col>

                <Col lg={3} sm={6}>
                    <StatsHorizontal
                        color={"secondary"}
                        statTitle={T("Blocked Calls")}
                        icon={<X size={20} />}
                        renderStats={
                            <h3 className={`fw-bolder mb-75`}>
                                {store && store.loading ? (
                                    onPlacetellCallStatsCount("blocked") || 0
                                ) : (
                                    <Spinner className="d-flex" />
                                )}
                            </h3>
                        }
                    />
                </Col>

                <Col lg={3} sm={6}>
                    <StatsHorizontal
                        color={"primary"}
                        statTitle={T("Voice messages")}
                        icon={<Voicemail size={20} />}
                        renderStats={
                            <h3 className={`fw-bolder mb-75`}>
                                {store && store.loading ? (
                                    onPlacetellCallStatsCount("voicemail") || 0
                                ) : (
                                    <Spinner className="d-flex" />
                                )}
                            </h3>
                        }
                    />
                </Col>
            </Row>
            {/* Placetel Call Stats Data */}

            {/* Listing table */}
            <Table />
            {/* /Listing table */}
        </Fragment>
    )
}

export default PlacetelCallList
