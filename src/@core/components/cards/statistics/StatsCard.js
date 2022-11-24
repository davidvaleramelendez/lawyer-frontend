// ** Third Party Components
import classnames from 'classnames'
import { Briefcase, Folder, FileText, CreditCard } from 'react-feather'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import {
  Col,
  Row,
  Card,
  CardBody,
  CardText,
  CardTitle,
  CardHeader
} from 'reactstrap'

const StatsCard = ({
  t,
  cols,
  totalAmount,
  openCasesCount,
  holdCasesCount,
  openInvoicesCount
}) => {
  const data = [
    {
      title: openCasesCount,
      subtitle: `${t("Open cases")}`,
      color: 'light-primary',
      icon: <Briefcase size={24} />
    },
    {
      title: holdCasesCount,
      subtitle: `${t("Open ticket")}`,
      color: 'light-danger',
      icon: <Folder size={24} />
    },
    {
      title: openInvoicesCount,
      subtitle: `${t("Open invoices")}`,
      color: 'light-info',
      icon: <FileText size={24} />
    },
    {
      title: totalAmount,
      subtitle: `${t("Amounts outstanding")}`,
      color: 'light-success',
      icon: <CreditCard size={24} />
    }
  ]

  const renderData = () => {
    return data.map((item, index) => {
      const colMargin = Object.keys(cols)
      const margin = index === 2 ? 'sm' : colMargin[0]
      return (
        <Col
          key={index}
          {...cols}
          className={classnames({
            [`mb-2 mb-${margin}-0`]: index !== data.length - 1
          })}
        >
          <div className="d-flex align-items-center">
            <Avatar color={item.color} icon={item.icon} className="me-2" />
            <div className="my-auto">
              <h4 className="fw-bolder mb-0">{item.title}</h4>
              <CardText className="font-small-3 mb-0">{item.subtitle}</CardText>
            </div>
          </div>
        </Col>
      )
    })
  }

  return (
    <Card className="card-statistics">
      <CardHeader>
        <CardTitle tag="h4">{t("Dashboard Overview")}</CardTitle>
        <CardText className="card-text font-small-2 me-25 mb-0">{t("Statistics")}</CardText>
      </CardHeader>
      <CardBody className="statistics-body">
        <Row>{renderData()}</Row>
      </CardBody>
    </Card>
  )
}

export default StatsCard
