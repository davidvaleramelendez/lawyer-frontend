// ** Reactstrap Imports
import {
    Row,
    Col
} from 'reactstrap'

// ** User List Component
import Table from './Table'

// ** Store
import { useSelector } from 'react-redux'

// ** Custom Components
import Spinner from '@components/spinner/Simple-spinner'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'

// ** Icons Imports
import {
    User,
    Slack
} from 'react-feather'

// ** Utils
import {
    isObjEmpty
} from '@utils'

// ** Styles
import '@styles/react/apps/app-users.scss'

const UsersList = () => {
    // ** Store vars
    const store = useSelector((state) => state.user)

    const onRenderUserStatsCount = (roleId = "") => {
        if (store && store.userStatItems && !isObjEmpty(store.userStatItems)) {
            if (store.userStatItems && store.userStatItems[roleId]) {
                return store.userStatItems[roleId].userCount || 0
            }
        }
        return 0
    }

    return (
        <div className='app-user-list'>
            {/* User Stats Data */}
            <Row>
                <Col lg={3} sm={6}>
                    <StatsHorizontal
                        color={"danger"}
                        statTitle={"Admin"}
                        icon={<Slack size={20} />}
                        renderStats={
                            <h3 className={`fw-bolder mb-75`}>
                                {store && store.loading ? (
                                    onRenderUserStatsCount(10) || 0
                                ) : (
                                    <Spinner className="d-flex" />
                                )}
                            </h3>
                        }
                    />
                </Col>

                <Col lg={3} sm={6}>
                    <StatsHorizontal
                        color={"success"}
                        statTitle={"Lawyer"}
                        icon={<User size={20} />}
                        renderStats={
                            <h3 className={`fw-bolder mb-75`}>
                                {store && store.loading ? (
                                    onRenderUserStatsCount(14) || 0
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
                        statTitle={"Partner"}
                        icon={<User size={20} />}
                        renderStats={
                            <h3 className={`fw-bolder mb-75`}>
                                {store && store.loading ? (
                                    onRenderUserStatsCount(12) || 0
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
                        statTitle={"Customer"}
                        icon={<User size={20} />}
                        renderStats={
                            <h3 className="fw-bolder mb-75">
                                {store && store.loading ? (
                                    onRenderUserStatsCount(11
                                    ) || 0) : (
                                    <Spinner className="d-flex" />
                                )}
                            </h3>
                        }
                    />
                </Col>
            </Row>
            {/* /User Stats Data */}

            {/* Listing table */}
            <Table />
            {/* /Listing table */}
        </div>
    )
}

export default UsersList
