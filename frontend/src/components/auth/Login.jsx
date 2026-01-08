import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2, Eye, EyeOff } from 'lucide-react'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const { loading,user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        
        // Validate all fields with specific error messages
        const email = input.email?.trim() || "";
        const password = input.password?.trim() || "";
        const role = input.role?.trim() || "";

        // Check if nothing is entered
        if (!email && !password && !role) {
            toast.error("Enter email, password and role");
            return;
        }

        // Check if email is missing
        if (!email) {
            toast.error("Email missing");
            return;
        }

        // Check if password is missing
        if (!password) {
            toast.error("Password missing");
            return;
        }

        // Check if role is missing (but email and password are entered)
        if (!role) {
            toast.error("Please mention if you are applicant or recruiter");
            return;
        }
        
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "An error occurred during login");
        } finally {
            dispatch(setLoading(false));
        }
    }
    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])
    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto px-4'>
                <form onSubmit={submitHandler} className='w-full sm:w-3/4 md:w-1/2 lg:w-2/5 border border-gray-200 rounded-md p-4 md:p-6 my-10'>
                    <h1 className='font-bold text-xl md:text-2xl mb-5'>Login</h1>
                    <div className='my-2'>
                        <Label className="mb-2 block">Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="patel@gmail.com"
                        />
                    </div>

                    <div className='my-2'>
                        <Label className="mb-2 block">Password</Label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={input.password}
                                name="password"
                                onChange={changeEventHandler}
                                placeholder="Enter your password"
                                className="pr-10"
                                style={{
                                    paddingRight: '2.5rem'
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none z-10 pointer-events-auto"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                tabIndex={0}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                    <div className='flex items-center justify-between'>
                        <RadioGroup className="flex items-center gap-4 my-5">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="applicant"
                                    checked={input.role === 'applicant'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r1">Applicant</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r2">Recruiter</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    {
                        loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Login</Button>
                    }
                    <span className='text-sm'>Don't have an account? <Link to="/signup" className='text-blue-600'>Signup</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Login