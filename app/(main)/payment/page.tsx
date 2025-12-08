"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  CreditCard, 
  CheckCircle2, 
  Copy, 
  ArrowRight,
  Check,
  Building2,
  AlertCircle
} from 'lucide-react'
import { NavbarClient } from '@/components/navbarclient'
import { Footer } from '@/components/footer'
import { toast } from 'react-toastify'

interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactNode
  number: string
  accountType: string
  instructions: string[]
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'bkash',
    name: 'bKash',
    icon: <Image src="/images/bkash.png" alt="bKash" width={24} height={24} className="h-6 w-6 object-contain" />,
    number: '01879235494',
    accountType: 'Bkash',
    instructions: [
      'Go to your bKash app or dial *247#',
      'Send money to: 01879235494',
      'Enter the amount: ৳2,000',
      'Enter your reference: BCNS Membership',
      'Complete the transaction and save the transaction ID'
    ]
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    icon: <Building2 className="h-6 w-6" />,
    number: '08536000112',
    accountType: 'BCNS Account',
    instructions: [
      'Account Name: Bangladesh Child Neurology Society (BCNS)',
      'Bank: Bank Asia PLC',
      'Account Number: 08536000112',
      'Routing Number: 070270202',
      'Branch: BSMMU',
      'Amount: ৳2,000',
      'Reference: BCNS Membership'
    ]
  }
]

function PaymentPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    const emailParam = searchParams.get('email')
    const nameParam = searchParams.get('name')
    
    if (!emailParam) {
      // If no email, redirect to membership page
      router.push('/membership')
      return
    }
    
    setEmail(emailParam)
    setName(nameParam || '')
  }, [searchParams, router])

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard!`)
  }

  const handlePaymentComplete = () => {
    if (!selectedMethod) {
      toast.error('Please select a payment method')
      return
    }
    
    if (!paymentConfirmed) {
      toast.error('Please confirm that you have completed the payment')
      return
    }
    
    setPaymentComplete(true)
    toast.success('Payment confirmed! Redirecting to login...')
    
    // Redirect to login page after 2 seconds
    setTimeout(() => {
      const loginUrl = email 
        ? `/login?registered=true&email=${encodeURIComponent(email)}&payment=completed`
        : '/login?registered=true&payment=completed'
      router.push(loginUrl)
    }, 2000)
  }

  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod)

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <>
      <NavbarClient />
      <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Membership Payment
            </h1>
            <p className="text-gray-600">
              Your registration is complete! Please complete the payment to activate your membership.
            </p>
            {name && (
              <p className="text-sm text-gray-500 mt-2">
                Member: <span className="font-semibold">{name}</span>
              </p>
            )}
          </div>

          {/* Payment Confirmed State */}
          {paymentComplete ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-green-900 mb-2">
                  Payment Confirmed! 🎉
                </h3>
                <p className="text-gray-600 mb-4">
                  Your payment has been recorded. You will be redirected to the login page shortly.
                </p>
                <p className="text-sm text-gray-500">
                  Please login with your credentials to access your account.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Payment Methods Selection */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle>Select Payment Method</CardTitle>
                  <CardDescription>
                    Choose your preferred payment method
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedMethod === method.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            selectedMethod === method.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {method.icon}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{method.name}</div>
                            <div className="text-sm text-gray-500">{method.accountType}</div>
                          </div>
                        </div>
                        {selectedMethod === method.id && (
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Payment Instructions */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle>Payment Instructions</CardTitle>
                  <CardDescription>
                    {selectedMethod
                      ? `Follow these steps to complete your ${selectedMethodData?.name} payment`
                      : 'Select a payment method to view instructions'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedMethod && selectedMethodData ? (
                    <div className="space-y-4">
                      {/* Payment Details */}
                      <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Amount:</span>
                          <span className="font-semibold text-lg">৳2,000</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Account Number:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold">{selectedMethodData.number}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(selectedMethodData.number, 'Account number')}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Step-by-step instructions:</h4>
                        <ol className="space-y-2">
                          {selectedMethodData.instructions.map((instruction, index) => (
                            <li key={index} className="flex gap-3 text-sm text-gray-700">
                              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                                {index + 1}
                              </span>
                              <span className={`flex-1 pt-0.5 ${instruction.startsWith('Account Name:') ? 'text-base sm:text-lg font-semibold text-gray-900' : ''}`}>
                                {instruction}
                              </span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Payment Confirmation Checkbox */}
                      <div className="pt-4 border-t">
                        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                          <Checkbox
                            id="payment-confirm"
                            checked={paymentConfirmed}
                            onCheckedChange={(checked) => setPaymentConfirmed(checked as boolean)}
                            className="mt-0.5"
                          />
                          <label
                            htmlFor="payment-confirm"
                            className="text-sm text-gray-700 cursor-pointer flex-1"
                          >
                            I confirm that I have completed the payment transaction as per the instructions above.
                          </label>
                        </div>
                      </div>

                      {/* Continue Button */}
                      <Button
                        onClick={handlePaymentComplete}
                        disabled={!paymentConfirmed}
                        className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        Continue to Login
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-600">
                        Please select a payment method to view instructions
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Important Notice */}
          {!paymentComplete && (
            <Card className="mt-6 bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Important Notice:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                      <li>Please ensure you include &quot;BCNS Membership&quot; as the reference in your payment</li>
                      <li>Your membership will be activated after payment verification (usually within 24-48 hours)</li>
                      <li>You will receive a confirmation email once your payment is verified</li>
                      <li>If you have any questions, please contact our support team</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
      <Footer />
    </>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading payment page...</p>
        </div>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  )
}
