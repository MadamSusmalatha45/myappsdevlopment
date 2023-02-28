import React, {useEffect, useState} from 'react';
import { getAPI } from '../../network';

export default function CompanyDashboard(){
   
    useEffect(() => {
        getSites()
    })

    const getSites = async() => {
        let data = await getAPI('/sites');
    }
    return(
        <div>
            <h1>Company Dashboard</h1>
        </div>
    )
}