import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { RiDashboardFill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import { FaGift } from "react-icons/fa6";
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { TbMessageReportFilled } from "react-icons/tb";
import { IoNotificationsSharp } from "react-icons/io5";
import { SiTransmission } from "react-icons/si";


const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/admin/dashboard',
    icon: <RiDashboardFill className="nav-icon" />,
    badge: {
      color: 'info',
      // text: 'NEW',
    },
  },

  {
    component: CNavItem,
    name: 'User',
    to: '/admin/tables',
    icon: <FaUsers className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Daily Wheel',
    to: '/admin/dailywheel',
    icon: <FaGift className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Report',
    to: '/admin/report',
    icon: <TbMessageReportFilled className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Mission',
    to: '/admin/mission',
    icon: <SiTransmission className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Notification',
    to: '/admin/notification',
    icon: <IoNotificationsSharp className="nav-icon" />,
  }
];

export default _nav
