import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Github, GitBranch, Monitor, Users, ShieldCheck, Code } from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
        <div dir="rtl" className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800" style={{ fontFamily: "'Noto Sans Arabic', 'Segoe UI', system-ui, sans-serif" }}>
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">جمعية الفكر الحاسوبي</h1>
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">جامعة سيئون</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300">منصة مشاركة الشاشة للمحاضرات والدروس العملية</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="hover:shadow-lg transition-shadow order-2 md:order-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-6 w-6" />
                                الانضمام للمحاضرة
                            </CardTitle>
                            <CardDescription>ادخل رمز الغرفة لمشاهدة شاشة المحاضر</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/join">
                                <Button className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-lg py-6">انضمام للغرفة</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow order-1 md:order-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Monitor className="h-6 w-6" />
                                    بدء المشاركة
                                </CardTitle>
                                <span className="flex items-center gap-1 text-sm text-gray-500">
                                    <ShieldCheck className="h-4 w-4" />
                                    خاص بالمدربين
                                </span>
                            </div>
                            <CardDescription>إنشاء غرفة جديدة ومشاركة شاشتك مع الطلاب</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/host">
                                <Button variant="outline" className="w-full">
                                    إنشاء غرفة
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Course Resources Section */}
                <div className="mt-16 border-t pt-8">
                    <h3 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">ملفات الدورة</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <GitBranch className="h-6 w-6" />
                                    Git للويندوز
                                </CardTitle>
                                <CardDescription>برنامج Git للتحكم بالإصدارات</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href="/resources/Git.exe" target="_blank">
                                    <Button variant="outline" className="w-full flex items-center gap-2">
                                        <Download className="h-4 w-4" />
                                        تحميل Git
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Github className="h-6 w-6" />
                                    GitHub Desktop
                                </CardTitle>
                                <CardDescription>واجهة رسومية للتعامل مع Git و GitHub</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href="/resources/GitHub.exe" target="_blank">
                                    <Button variant="outline" className="w-full flex items-center gap-2">
                                        <Download className="h-4 w-4" />
                                        تحميل GitHub Desktop
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Code className="h-6 w-6" />
                                    VS Code
                                </CardTitle>
                                <CardDescription>محرر الأكواد المتقدم من مايكروسوفت</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href="/resources/VSCode.exe" target="_blank">
                                    <Button variant="outline" className="w-full flex items-center gap-2">
                                        <Download className="h-4 w-4" />
                                        تحميل VS Code
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
