import { createRoot } from 'react-dom/client';
import './index.css';
// import 'https://cdn.syncfusion.com/ej2/material.css'
import * as React from 'react';
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  TimelineViews,
  Inject,
  ResourcesDirective,
  ResourceDirective,
  Resize,
  DragAndDrop,
} from '@syncfusion/ej2-react-schedule';
import { deleteAPI, getAPI, patchAPI, postAPI } from "../../../network";

import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { SampleBase } from './sample-base';
import { DataManager, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { useParams } from 'react-router-dom';

class SiteViewPage extends SampleBase {

  data = extend([], [], null, true);
  scheduleObj;
  
  constructor(props) {

    super(props)

    this.siteId = window.location.pathname.split("/")[2];
    this.ownerData = [
      {
        "id": "6319eb076ffe75d9b5a2b2e6",
        "name": "Static",
        "createdAt": "2022-09-08T13:15:51.430Z"
      },
      {
        "id": "6319eb026ffe75d9b5a2b2e3",
        "name": "Rover",
        "createdAt": "2022-09-08T13:15:46.298Z"
      },
      {
        "id": "6319eafc6ffe75d9b5a2b2e0",
        "name": "Controller",
        "createdAt": "2022-09-08T13:15:40.164Z"
      },
      {
        "id": "6319eaf16ffe75d9b5a2b2dd",
        "name": "Manager",
        "createdAt": "2022-09-08T13:15:29.846Z"
      }
    ]
    this.getRoles();
    this.getTeam()
  }
  getTime(time) {

    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/\D{2}$/)[0];
    if (AMPM === "PM" && hours < 12) hours = hours + 12;
    if (AMPM === "AM" && hours === 12) hours = hours - 12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    return sHours + ":" + sMinutes;
  }
  async getRoles() {
    let data = await getAPI('/roles');
    let rosterData = await getAPI(`/company/roster?siteId=${this.siteId}`);
    rosterData.map(e => {
      e.Id = e.role?._id
      e.shiftId = e.id
      // e.Id=1
      let etime = this.getTime(e.endTime)
      let stime = this.getTime(e.startTime)
      e.startDate = e.startDate.split('T')[0]
      e.endDate = e.endDate.split('T')[0]
      e.Subject = e.assignedUser ? `${e.assignedUser.firstname} ${e.assignedUser.lastname}` : 'Not Assigned'
      e.StartTime = new Date(`${e.startDate} ${stime}`)
      e.EndTime = new Date(`${e.endDate} ${etime}`)
      e.RoomId = e.role?._id
      e.uuid = e.assignedUser?._id || ""
    })
    this.data = rosterData

    this.ownerData = []
    data.map(e => {
      e.text = e.name
    })
    this.scheduleObj.resourceCollection[0].dataSource = data
    this.scheduleObj.eventSettings.dataSource = rosterData
  }
  async getTeam() {
    this.siteTeam = await getAPI(`/sites/site-team/${this.siteId}`);

  }
  getRoomName(value) {
    return value.resourceData[value.resource.textField];
  }
  getRoomType(value) {
    return value.resourceData.type;
  }
  getRoomCapacity(value) {
    return value.resourceData.capacity;
  }
  isReadOnly(endDate) {
    return endDate < new Date(2021, 6, 31, 0, 0);
  }
  resourceHeaderTemplate(props) {
    return (
      <div className="template-wrap">
        <div className="room-name">{this.getRoomName(props)}</div>
        {/* <div className="room-type">{this.getRoomType(props)}</div>
            <div className="room-capacity">{this.getRoomCapacity(props)}</div> */}
      </div>
    );
  }
  onActionBegin(args) {

    if (args.requestType === 'eventChange') {
      const data = {
        'userId': args.changedRecords[0].EventType
      }

      const shiftCode = args.data.shiftCode

      let apiresp = postAPI(`/company/roster/reassign/${args.data.id}`, data)


      this.getRoles();
    }


    if (args.requestType === "eventRemove") {


      const roasterId = args.data[0].id

      let apiresponse = deleteAPI(`/company/roster/${roasterId}`)

      this.getRoles();
    }



    if (args.requestType === "eventRemove") {
      const roasterId = args.data[0].id
      let apiresponse = deleteAPI(`/company/roster/${roasterId}`)

      this.getRoles();
    }


  }
  onEventRendered(args) {
    let data = args.data;
    if (this.isReadOnly(data.EndTime)) {
      args.element.setAttribute('aria-readonly', 'true');
      args.element.classList.add('e-read-only');
    }
  }
  onRenderCell(args) {
    document.getElementById('js-licensing').hidden = true
    if (args.element.classList.contains('e-work-cells')) {
      if (args.date < new Date(2021, 6, 31, 0, 0)) {
        args.element.setAttribute('aria-readonly', 'true');
        args.element.classList.add('e-read-only-cells');
      }
    }
    if (
      args.elementType === 'emptyCells' &&
      args.element.classList.contains('e-resource-left-td')
    ) {
      let target = args.element.querySelector('.e-resource-text');
      target.innerHTML = '<div class="name">Team</div>';
    }
  }
  onPopupOpen(args) {
    let data = args.data;
    if (
      args.type === 'QuickInfo' ||
      args.type === 'Editor' ||
      args.type === 'RecurrenceAlert' ||
      args.type === 'DeleteAlert'
    ) {
      let target =
        args.type === 'RecurrenceAlert' || args.type === 'DeleteAlert'
          ? args.element[0]
          : args.target;



      if (
        !isNullOrUndefined(target) &&
        target.classList.contains('e-work-cells')
      ) {
        if (
          target.classList.contains('e-read-only-cells') ||
          !this.scheduleObj.isSlotAvailable(data)
        ) {
          args.cancel = true;
        }
      } else if (
        !isNullOrUndefined(target) &&
        target.classList.contains('e-appointment') &&
        this.isReadOnly(data.EndTime)
      ) {
        args.cancel = true;
      }
    }
  }
  editorTemplate(props) {
    return (props !== undefined ? <table className="custom-event-editor" style={{ width: '100%', cellpadding: '5' }}><tbody>
      <tr><td className="e-textlabel">Select User</td><td colSpan={4}>
        <DropDownListComponent id="EventType" placeholder='Select User' data-name="EventType" className="e-field" style={{ width: '100%' }} dataSource={this.siteTeam} fields={{ 'text': 'firstname', value: '_id' }} value={props.uuid || null}></DropDownListComponent>
      </td></tr>

    </tbody></table> : <div></div>);
  }
  render() {
    return (
      <div className="schedule-control-section">
        <div className="col-lg-12 control-section">
          <div className="control-wrapper">
            <ScheduleComponent
              cssClass="timeline-resource"
              ref={(schedule) => (this.scheduleObj = schedule)}
              width="100%"
              height="600px"
              selectedDate={new Date()}
              workHours={{ start: '08:00', end: '18:00' }}
              timeScale={{ interval: 360, slotCount: 3 }}
              resourceHeaderTemplate={this.resourceHeaderTemplate.bind(this)}
              eventSettings={{
                dataSource: this.data,
                fields: {
                  id: 'Id',
                  subject: { title: 'Summary', name: 'Subject' },
                  startTime: { title: 'From', name: 'StartTime' },
                  endTime: { title: 'To', name: 'EndTime' },
                },
              }}
              eventRendered={this.onEventRendered.bind(this)}
              editorTemplate={this.editorTemplate.bind(this)}

              popupOpen={this.onPopupOpen.bind(this)}
              actionBegin={this.onActionBegin.bind(this)}
              renderCell={this.onRenderCell.bind(this)}
              group={{ enableCompactView: false, resources: ['MeetingRoom'] }}
            >
              <ResourcesDirective>
                <ResourceDirective
                  field="RoomId"
                  title="Room Type"
                  name="MeetingRoom"
                  allowMultiple={true}
                  dataSource={this.ownerData}
                  textField="name"
                  idField="id"
                  colorField="color"
                ></ResourceDirective>
              </ResourcesDirective>
              <ViewsDirective>
                <ViewDirective option="TimelineDay" />
                <ViewDirective option="TimelineWeek" />
              </ViewsDirective>
              <Inject services={[TimelineViews, Resize, DragAndDrop]} />
            </ScheduleComponent>
          </div>
        </div>
      </div>
    );
  }
}

// const root = createRoot(document.getElementById('sample'));
// root.render(<TimelineResource />);

export default SiteViewPage
