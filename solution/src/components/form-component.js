import React, { useState, useEffect } from 'react';
import {isNameValid, getLocations} from '../mock-api/apis';

export function FormComponent(){
    const [countryList, setCounryList] = useState([]);
    const [userData, setUserData] = useState([{}]);
    const [formData, setFormData] = useState({userName: '', location: ''});
    const [nameIsValid, setNameIsValid] = useState(false);

    // mock API provides array of countries for dropdown
    useEffect(() => {
        getLocations().then((v) => {
            setCounryList([...v]);
            setFormData({userName: formData.userName,location: v[0]});
        });
    } , [formData.userName]);

    // save user form input
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value  
        });
    }

    // form validation
    useEffect(() => {
        // blank name is not valid
        if(formData.userName === ''){
            setNameIsValid(false);
        } 
        // Check for duplicate name
        const i = userData.findIndex(e => e.userName === formData.userName);
            if (i > -1) {
                // mock API call
                isNameValid('invalid name').then((v) => {
                setNameIsValid(false);
                return v;
            });
        } else {
            setNameIsValid(true);
        }
    },[formData.userName, userData]);

    // save user info to table
    // function needs to be an async function so we have the result of isNameValid, otherwise this would be a race condition in a real life app and be buggy
    async function saveUser(){
        const result = await isNameValid;
        if(result && formData.userName !== '' && nameIsValid){
            if(userData.length > 0){ 
                setUserData([...userData, formData]);
            } else {
                setUserData([formData]);
            }
            setFormData({userName: '', location: ''})
        }
    }

    return (
        <div className='form-grid'>
            <form >
                <div className='row'>
                    <label for='nameField'>Name</label>
                        <input 
                            id='nameField'
                            onChange={(e) => handleChange(e)}
                            placeholder={'Name'}
                            name={'userName'}
                            value={formData.userName}
                            type='text' />
                </div>
                {formData.userName !== 'undefined' && !nameIsValid &&
                    <div className='errorMessage'>this name has already been taken</div>
                }
                <div className='row'>
                    <label for='countrySelect'>Location</label>
                    <select id='countrySelect' onChange={(e) => handleChange(e)} name={'location'} value={formData.location}>
                         {countryList.length > 0 && countryList.map((country, index) => (
                        <option key={index} value={country}>{country}</option>
                        ))} 
                    </select>
                </div>
                <div className='form-buttons'>
                    <input type='reset' value={'Clear'} onClick={() => setFormData({userName: '', location: ''})} />
                    <input type='button' value={'Add'} onClick={() => saveUser()} />
                </div>
            </form>
            <DataTable />
        </div>
    )
    // in a real life app, this may be a separate component depending on it's complexity or if it is reusable
    function DataTable(){
        return (
            <div>
                <table>
                    <thead> 
                    <tr>
                        <th><span>Name</span></th>
                        <th><span>Location</span></th>
                    </tr> 
                    </thead>
                    <tbody>
                    {userData !== 'undefined' && userData.map((user, index) => (
                    <tr id={`user-${index}`} key={index}>
                        <td>{user.userName}</td>
                        <td>{user.location}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
              </div>
            );
    }
}