import React, { useState } from "react"
import { RouteComponentProps, Router } from "@reach/router"

import BodyCard from "../../../components/organisms/body-card"
import CustomerGroupsTable from "../../../components/templates/customer-group-table/customer-groups-table"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import CustomerGroupModal from "./customer-group-modal"
import CustomersPageTableHeader from "../header"
import Details from "./details"

/**
 * Customer groups index page
 */
function Index(_: RouteComponentProps) {
  const [showModal, setShowModal] = useState(false)

  const actions = [
    {
      label: "New group",
      onClick: () => setShowModal(true),
      icon: (
        <span className="text-grey-90">
          <PlusIcon size={20} />
        </span>
      ),
    },
  ]

  const handleClose = () => setShowModal(false)

  return (
    <div className="flex flex-col grow h-full">
      <div className="w-full flex flex-col grow">
        <BodyCard
          actionables={actions}
          customHeader={<CustomersPageTableHeader activeView="groups" />}
        >
          <CustomerGroupsTable />
        </BodyCard>
      </div>
      {showModal && <CustomerGroupModal handleClose={handleClose} />}
    </div>
  )
}

/**
 * Customer groups routes
 */
function CustomerGroups(_: RouteComponentProps) {
  return (
    <Router basepath="/a/customers/groups">
      <Index path="/" />
      <Details path=":id" />
    </Router>
  )
}

export default CustomerGroups
