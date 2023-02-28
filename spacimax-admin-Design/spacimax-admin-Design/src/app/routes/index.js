import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardPage from "../containers/dashboard";
import FAQPage from "../containers/faq";
import ReportsPage from "../containers/reports";
import SchedulerPage from "../containers/scheduler";
import SitesPage from "../containers/sites";
import SiteDetailPage from "../containers/sites/detail";
import SiteFixedRoasterPage from "../containers/sites/detail/FixedRoaster/FixedRoaster";
import SiteDataPage from "../containers/sites/detail/SitesData";
import LoginPage from "../containers/login";
import SchedulerLogin from "../containers/scheduler/login";
import ProtectedWrapper from "../layout/ProtectedWrapper";
import ProtectedCompany from "../layout/ProtectedCompany"
import ProtectedAdmin from "../layout/ProtectedAdmin"
import TimesheetPage from "../containers/timesheet";
import TimesheetResultPage from "../containers/timesheet/result";
import EditFixedRoster from "../containers/sites/detail/FixedRoaster/EditFixedRoster";
import SitesOverviewPage from "../containers/sites/detail/Overview";
import SiteSettingsPage from "../containers/sites/SiteSetting";
import ViewAdvertisedShiftsPage from "../containers/scheduler/ViewAdvertisedShifts";
import CreateAlarmResponse from "../containers/scheduler/CreateAlarmResponse";
import CasualShiftsPage from "../containers/scheduler/CasualShift";
import UserLicensePage from "../containers/user/license";
import TrackerPage from "../containers/tracker";
import SupportPage from "../containers/support";
import NotificationPage from "../containers/notification";
import PortfolioReportPage from "../containers/reports/portfolio";
import ShiftReportPage from "../containers/reports/shift";
import IncidentReportPage from "../containers/reports/incident";
import CreateRoasterPage from "../containers/sites/detail/FixedRoaster/CreateRoaster";
import SiteDocumentPage from "../containers/sites/document";
import SiteInspectionPage from "../containers/sites/inspection";
import SiteFormPage from "../containers/sites/form";
import SiteTeamPage from "../containers/sites/team";
import CustomReportPage from "../containers/reports/custom";
import TipPage from "../containers/tip";
import AlertPage from "../containers/alert";
import SiteViewPage from "../containers/sites/view";
import AddTask from "../containers/tasks/addTask";
import TaskList from "../containers/tasks/taskList";
import UserList from "../containers/users";
import AddUser from "../containers/users/addUser";
import Guards from "../containers/guards";
import FaqQuestion from "../containers/faq/question";
import FaqDetail from "../containers/faq/detail";
import PrivacyPolicy from "../containers/faq/policy";
import UserGuide from "../containers/faq/guide";
import Company from "../containers/company";
import License from "../containers/guards/license";
import Profile from "../containers/guards/profile";
import CompanyTracker from "../company/tracker";
import Permission from "../containers/permission";
import Role from "../containers/role"
import Vendor from "../containers/vendor";
import CompanyAllUsers from "../containers/company/companyUser";
import VendorClient from "../containers/vendor/client";
import LicenseType from "../containers/licenseType";
import Shifttype from "../containers/shiftType";
import Person from "../containers/person";
import TaskDetails from "../containers/tasks/taskDetails"


// company Route
import CompanyDashboard from "../company/dashboard";
import CompanyLogin from "../company/login";
import CompanySite from "../company/site";
import CompanyUsers from "../company/user";
import RoutePermission from "../layout/RoutePermission";

function PageRoutes() {
  const [siteId, setSiteId] = React.useState("");

  const handleSiteId = (id) => {
    setSiteId(id)
  }
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <DashboardPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/sites"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <SitesPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/companies"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <Company />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/company/users"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <CompanyAllUsers />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/vendors"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <Vendor />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/vendor/:vendorId/clients"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <VendorClient />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/sites/:siteId/site-view-fixed-roaster"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <SiteViewPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/sites/:siteId/fixed-roaster"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <SiteFixedRoasterPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/sites/:siteId/site-data"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <SiteDataPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/sites/:siteId/overview"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <SitesOverviewPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/sites/:siteId/edit-fixed-roaster"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <EditFixedRoster />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/sites/:siteId/fixed-roaster/create-fixed-roaster"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <CreateRoasterPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/sites/:siteId/setting"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <SiteSettingsPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/sites/:siteId/documents"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <SiteDocumentPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/sites/:siteId/inspection"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <SiteInspectionPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/sites/:siteId/inspection/form/:id/:repId/:inspId"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <SiteFormPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/sites/:siteId/team"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <SiteTeamPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/sites/:siteId"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <SiteDetailPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <ReportsPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/faq"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <FAQPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/faq/:faqId"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <FaqDetail />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/faq/frequently-asked-questions"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <FaqQuestion />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/scheduler"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <SchedulerPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />
      <Route path="/scheduler-login" element={<SchedulerLogin />} />

      <Route
        path="/scheduler/view-advertised-shifts"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <ViewAdvertisedShiftsPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/scheduler/casual-shifts"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <CasualShiftsPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <Person />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/guards"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <Guards />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/users/create"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <AddUser />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/timesheets"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <TimesheetPage onHandler={handleSiteId} />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/timesheets/result"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <TimesheetResultPage siteId={siteId} />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/scheduler/create-alarm-response"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <CreateAlarmResponse />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/users/license"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <UserLicensePage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/trackers"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <TrackerPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/supports"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <SupportPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <NotificationPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/portfolio/reports"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <PortfolioReportPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/shift/reports"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <ShiftReportPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/incident/reports"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <IncidentReportPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/supports"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <SupportPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />
      <Route
        path="/licensetype"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <LicenseType />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/shifttype"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <Shifttype />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />



      <Route
        path="/trackers"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <TrackerPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/custom/reports"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <CustomReportPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/scheduler/create-alarm-response"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <CreateAlarmResponse />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/safety-tips"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <TipPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/alert-information"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <AlertPage />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/tasks/create"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <AddTask />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/tasks/details"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin >
              {/* <RoutePermission permission="VIEW_TASKS"> */}
                <TaskDetails />
              {/* </RoutePermission> */}
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/tasks/list"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <TaskList />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/faq/privacy-policy"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <PrivacyPolicy />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/faq/user-guide"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <UserGuide />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/faq/user-guide"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <UserGuide />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/user/license/:id"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <License />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/user/profile/:id"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <Profile />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/roles"
        element={
          <ProtectedWrapper>
            <ProtectedAdmin>
              <Role />
            </ProtectedAdmin>
          </ProtectedWrapper>
        }
      />

      <Route path="/company/login" element={<CompanyLogin />} />

      <Route
        path="/company"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="VIEW_DASHBOARD">
                <CompanyDashboard />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/company/sites"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="VIEW_SITES">
                <CompanySite />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/company/users"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="VIEW_GUARDS">
                <CompanyUsers />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/company/trackers"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="VIEW_TRACKER">
                <CompanyTracker />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/company/sites/:siteId/site-view-fixed-roaster"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="VIEW_FIXED_ROASTERS">
                <SiteViewPage />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/company/sites/:siteId"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="VIEW_SITES">
                <SiteDetailPage />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />


      <Route
        path="/company/sites/:siteId/site-data"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              {/* <RoutePermission permission="VIEW_SITE_OVERVIEWS"> */}
              <SiteDataPage />
              {/* </RoutePermission> */}
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />
      <Route
        path="/company/sites/:siteId/overview"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="VIEW_SITE_OVERVIEWS">
                <SitesOverviewPage />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/company/sites/:siteId/edit-fixed-roaster"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="EDIT_FIXED_ROASTER">
                <EditFixedRoster />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/company/sites/:siteId/fixed-roaster/create-fixed-roaster"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="ADD_ROASTER">
                <CreateRoasterPage />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/company/sites/:siteId/setting"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="VIEW_SITE_SETTINGS">
                <SiteSettingsPage />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/company/sites/:siteId/documents"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="VIEW_SITE_DOCUMENTS">
                <SiteDocumentPage />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/company/sites/:siteId/inspection"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="VIEW_SITE_INSPECTIONS">
                <SiteInspectionPage />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/company/sites/:siteId/inspection/form/:id/:repId/:inspId"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="ADD_INSPECTION_FORM">
                <SiteFormPage />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/company/sites/:siteId/team"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="VIEW_SITE_TEAMS">
                <SiteTeamPage />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/company/sites/:siteId/fixed-roaster"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="VIEW_FIXED_ROASTERS">
                <SiteFixedRoasterPage />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />


      <Route
        path="/company/reports"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="VIEW_SITE_REPORTS">
                <ReportsPage />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/company/guards"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="VIEW_GUARDS">
                <Guards />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />


      <Route
        path="/company/timesheets"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="VIEW_TIMESHEETS">
                <TimesheetPage onHandler={handleSiteId} />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/company/scheduler"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="VIEW_SCHEDULER">
                <SchedulerPage />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/company/scheduler/create-alarm-response"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="CREATE_ALARM_RESPONSE">
                <CreateAlarmResponse />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/company/scheduler/casual-shifts"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              {/* <RoutePermission permission="CREATE_CASUAL_SHIFT"> */}
              <CasualShiftsPage />
              {/* </RoutePermission> */}
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/company/scheduler/view-advertised-shifts"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="VIEW_ADVERTISED_SHIFT">
                <ViewAdvertisedShiftsPage />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/company/custom/reports"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="VIEW_CUSTOM_REPORTS">
                <CustomReportPage />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/company/portfolio/reports"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="VIEW_PORTFOLIO_REPORTS">
                <PortfolioReportPage />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/company/shift/reports"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="VIEW_SHIFT_REPORTS">
                <ShiftReportPage />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/company/incident/reports"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="VIEW_INCIDENT_REPORTS">
                <IncidentReportPage />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/company/alert-information"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="VIEW_ALERTS">
                <AlertPage />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />


      <Route
        path="/company/safety-tips"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="VIEW_TIPS">
                <TipPage />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/company/notifications"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="VIEW_NOTIFICATIONS">
                <NotificationPage />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />

      {/* <Route
        path="/company/faq"
        element={
          <ProtectedWrapper>
            <FAQPage />
          </ProtectedWrapper>
        }
      /> */}

      <Route
        path="/company/tasks/list"
        element={
          <ProtectedWrapper>
            <ProtectedCompany>
              <RoutePermission permission="VIEW_TASKS">
                <TaskList />
              </RoutePermission>
            </ProtectedCompany>
          </ProtectedWrapper>
        }
      />

      <Route
        path="/permission"
        element={<Permission />}
      />

    </Routes>
  );
}

export default PageRoutes;
