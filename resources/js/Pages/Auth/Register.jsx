import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        contact: '',
        role: 'farmer',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="rc-card rc-parchment-bg p-6">
                <div className="mb-6 text-center">
                    <h2 className="rc-serif-heading text-2xl font-semibold text-forest-soft">Create Account</h2>
                    <p className="text-sm text-gray-700 mt-1">Join the Rice Connect network today</p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="first_name" value="First Name" />
                        <TextInput
                            id="first_name"
                            name="first_name"
                            value={data.first_name}
                            className="mt-1 block w-full"
                            autoComplete="given-name"
                            isFocused={true}
                            onChange={(e) => setData('first_name', e.target.value)}
                            required
                        />
                        <InputError message={errors.first_name} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="last_name" value="Last Name" />
                        <TextInput
                            id="last_name"
                            name="last_name"
                            value={data.last_name}
                            className="mt-1 block w-full"
                            autoComplete="family-name"
                            onChange={(e) => setData('last_name', e.target.value)}
                            required
                        />
                        <InputError message={errors.last_name} className="mt-2" />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="contact" value="Contact Number" />
                    <TextInput
                        id="contact"
                        name="contact"
                        value={data.contact}
                        className="mt-1 block w-full"
                        placeholder="09XXXXXXXXX"
                        onChange={(e) => setData('contact', e.target.value)}
                        required
                    />
                    <InputError message={errors.contact} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="role" value="Register As" />
                    <select
                        id="role"
                        name="role"
                        value={data.role}
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        onChange={(e) => setData('role', e.target.value)}
                        required
                    >
                        <option value="farmer">Farmer</option>
                        <option value="miller">Miller</option>
                        <option value="retailer">Retailer</option>
                        <option value="driver">Driver</option>
                        <option value="admin">Admin</option>
                    </select>
                    <InputError message={errors.role} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Confirm" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>
                </div>

                    <div className="mt-6 flex items-center justify-between">
                        <Link href={route('login')} className="text-sm text-gray-700 underline">Already registered?</Link>

                        <PrimaryButton className="px-8 bg-emerald-700 hover:bg-emerald-800" disabled={processing}>
                            Create Account
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
