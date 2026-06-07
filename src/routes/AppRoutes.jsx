import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from '../pages/auth/Login'
import Signup from '../pages/auth/SIgnup'
import Dashboard from '../pages/dashboard/Dashboard'
import CreateAgent from '../pages/createagent'
import EmployeeSubmit from '../pages/EmployeeSubmit.new'
import SubmissionsDatabase from '../pages/ManagerDashboard'


function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/create-agent' element={<CreateAgent />} />
                <Route path='/submit/:agentId' element={<EmployeeSubmit />} />
                <Route path='/submissions' element={<SubmissionsDatabase />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes