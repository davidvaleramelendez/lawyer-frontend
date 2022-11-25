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

    return (
        <div className='app-user-list'>
            <Row>
                <Col
                    lg={3}
                    sm={6}
                >
                    <StatsHorizontal
                        color={"danger"}
                        statTitle={"Admin"}
                        icon={<Slack size={20} />}
                        renderStats={
                            <h3 className={`fw-bolder mb-75`}>
                                {store && store.userStatItems && !isObjEmpty(store.userStatItems) ? (store.userStatItems && store.userStatItems[10] && store.userStatItems[10].userCount) || 0 : <Spinner className="d-flex" />}
                            </h3>
                        }
                    />
                </Col>

                <Col
                    lg={3}
                    sm={6}
                >
                    <StatsHorizontal
                        color={"success"}
                        statTitle={"Lawyer"}
                        icon={<User size={20} />}
                        renderStats={
                            <h3 className={`fw-bolder mb-75`}>
                                {store && store.userStatItems && !isObjEmpty(store.userStatItems) ? (store.userStatItems && store.userStatItems[14] && store.userStatItems[14].userCount) || 0 : <Spinner className="d-flex" />}
                            </h3>
                        }
                    />
                </Col>

                <Col
                    lg={3}
                    sm={6}
                >
                    <StatsHorizontal
                        color={"primary"}
                        statTitle={"Partner"}
                        icon={<User size={20} />}
                        renderStats={
                            <h3 className={`fw-bolder mb-75`}>
                                {store && store.userStatItems && !isObjEmpty(store.userStatItems) ? (store.userStatItems && store.userStatItems[12] && store.userStatItems[12].userCount) || 0 : <Spinner className="d-flex" />}
                            </h3>
                        }
                    />
                </Col>

                <Col
                    lg={3}
                    sm={6}
                >
                    <StatsHorizontal
                        color={"primary"}
                        statTitle={"Customer"}
                        icon={<User size={20} />}
                        renderStats={
                            <h3 className="fw-bolder mb-75">
                                {store && store.userStatItems && !isObjEmpty(store.userStatItems) ? (store.userStatItems && store.userStatItems[11] && store.userStatItems[11].userCount) || 0 : <Spinner className="d-flex" />}
                            </h3>
                        }
                    />
                </Col>
            </Row>
            <Table />
        </div>
    )
}

export default UsersList
