import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  X,
  Calendar,
  Truck,
  CheckCircle2,
  Sparkles,
  Coins,
  Leaf,
  ShieldCheck,
  Package
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

const DEFAULT_CATEGORIES = [
  { id: 'plastic', name: 'Plastics & Polymers', rate: 20, co2: 1.8 },
  { id: 'ewaste', name: 'E-Waste & Electronics', rate: 60, co2: 14.5 },
  { id: 'organic', name: 'Organic & Wet Waste', rate: 5, co2: 0.9 },
  { id: 'metal', name: 'Metals & Scrap Alloys', rate: 40, co2: 4.2 },
  { id: 'paper', name: 'Paper & Cardboard', rate: 15, co2: 1.2 },
  { id: 'glass', name: 'Glass & Cullet', rate: 8, co2: 0.8 },
  { id: 'textile', name: 'Textiles & Fabric', rate: 24, co2: 3.5 }
];

export default function BookingModal({
  open,
  onClose,
  collector,
  defaultWasteType,
  onBookingSuccess
}) {
  const [bookingType, setBookingType] = useState('dropoff'); // 'dropoff' or 'doorstep_pickup'
  const [wasteCategory, setWasteCategory] = useState(
    defaultWasteType && defaultWasteType !== 'all' ? defaultWasteType : 'plastic'
  );
  const [estimatedWeightKg, setEstimatedWeightKg] = useState('10');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 01:00 PM');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Compute live estimated earnings and CO2
  const currentCat = DEFAULT_CATEGORIES.find(c => c.id === wasteCategory) || DEFAULT_CATEGORIES[0];
  const weightNum = parseFloat(estimatedWeightKg) || 0;
  const estimatedReward = Math.round(weightNum * currentCat.rate);
  const estimatedCo2 = Math.round(weightNum * currentCat.co2 * 10) / 10;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName.trim() || !userPhone.trim()) {
      setErrorMsg('Please provide your name and phone number');
      return;
    }
    if (bookingType === 'doorstep_pickup' && !userAddress.trim()) {
      setErrorMsg('Please provide your pickup address in Tamil Nadu');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      const payload = {
        collectorId: collector?._id || 'tn_central_depot',
        collectorName: collector?.name || 'Tamil Nadu Recycling Center',
        type: bookingType,
        wasteCategory,
        estimatedWeightKg: weightNum,
        userName,
        userPhone,
        userAddress: userAddress || collector?.address || 'Direct Center Drop-off',
        district: collector?.district || 'Tamil Nadu',
        scheduledDate,
        timeSlot,
        notes
      };

      const result = await api.createBooking(payload);

      if (result.success) {
        setConfirmedBooking(result.booking);
        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#38bdf8', '#fbbf24']
        });

        if (onBookingSuccess) {
          onBookingSuccess(result.booking);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit booking');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setConfirmedBooking(null);
    setErrorMsg('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleResetAndClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#0f172a',
          backgroundImage: 'radial-gradient(ellipse at top, rgba(16, 185, 129, 0.15), transparent 70%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3,
          color: '#f8fafc'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">
              {confirmedBooking ? 'Booking Confirmed!' : 'Schedule Waste Collection'}
            </h3>
            <p className="text-xs text-slate-400">
              {collector ? collector.name : 'Tamil Nadu Waste Network'}
            </p>
          </div>
        </div>

        <IconButton onClick={handleResetAndClose} sx={{ color: '#94a3b8' }}>
          <X className="w-5 h-5" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', px: 3, py: 2.5 }}>
        {confirmedBooking ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-xl font-black text-white">Your Request is Confirmed!</h4>
              <p className="text-xs text-slate-400 mt-1">
                Depot operators will verify and weigh your materials upon arrival.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-left space-y-2 max-w-md mx-auto text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Tracking Reference:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{confirmedBooking.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Center:</span>
                <span className="font-semibold text-white">{confirmedBooking.collectorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Scheduled Date:</span>
                <span className="font-semibold text-white">{confirmedBooking.scheduledDate} ({confirmedBooking.timeSlot})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Weight:</span>
                <span className="font-semibold text-white">{confirmedBooking.estimatedWeightKg} kg ({confirmedBooking.wasteCategory})</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-400">Estimated Cash Reward:</span>
                <span className="font-black text-emerald-400 text-sm">₹{confirmedBooking.estimatedReward}</span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <Alert severity="error" sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
                {errorMsg}
              </Alert>
            )}

            {/* Mode selection: Drop-off or Doorstep Pickup */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBookingType('dropoff')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  bookingType === 'dropoff'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="font-bold text-xs block text-white">Direct Drop-Off</span>
                <span className="text-[11px] text-slate-400">You drop off at the center</span>
              </button>

              <button
                type="button"
                onClick={() => setBookingType('doorstep_pickup')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  bookingType === 'doorstep_pickup'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="font-bold text-xs block text-white">Doorstep Pickup</span>
                <span className="text-[11px] text-slate-400">Eco-van collects at your home</span>
              </button>
            </div>

            {/* Waste Category & Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextField
                select
                label="Waste Category"
                size="small"
                value={wasteCategory}
                onChange={(e) => setWasteCategory(e.target.value)}
                fullWidth
              >
                {DEFAULT_CATEGORIES.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name} (₹{option.rate}/kg)
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Estimated Weight (kg)"
                size="small"
                type="number"
                inputProps={{ min: 1, max: 1000 }}
                value={estimatedWeightKg}
                onChange={(e) => setEstimatedWeightKg(e.target.value)}
                fullWidth
              />
            </div>

            {/* Live Calculation preview banner */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/30">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Estimated Cash Reward</span>
                  <span className="text-base font-black text-emerald-400">₹{estimatedReward}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-teal-400" />
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">CO2 Emissions Saved</span>
                  <span className="text-base font-black text-teal-300">{estimatedCo2} kg</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextField
                label="Your Full Name"
                size="small"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                fullWidth
              />

              <TextField
                label="Phone Number"
                size="small"
                placeholder="+91 98400 XXXXX"
                required
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                fullWidth
              />
            </div>

            {bookingType === 'doorstep_pickup' && (
              <TextField
                label="Pickup Address in Tamil Nadu"
                size="small"
                required
                multiline
                rows={2}
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                fullWidth
                placeholder="Door No, Street Name, Landmark, City/Town"
              />
            )}

            {/* Scheduled Date and Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextField
                label="Scheduled Date"
                type="date"
                size="small"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              <TextField
                select
                label="Preferred Time Slot"
                size="small"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                fullWidth
              >
                <MenuItem value="08:00 AM - 11:00 AM">08:00 AM - 11:00 AM</MenuItem>
                <MenuItem value="11:00 AM - 02:00 PM">11:00 AM - 02:00 PM</MenuItem>
                <MenuItem value="02:00 PM - 05:00 PM">02:00 PM - 05:00 PM</MenuItem>
                <MenuItem value="05:00 PM - 07:30 PM">05:00 PM - 07:30 PM</MenuItem>
              </TextField>
            </div>

            <TextField
              label="Notes (Optional)"
              size="small"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g., boxes already packed, bulk electronics scrap"
              fullWidth
            />
          </form>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5, bgcolor: '#0b1120', borderTop: '1px solid rgba(255, 255, 255, 0.05)', justifyContent: 'space-between' }}>
        <Button onClick={handleResetAndClose} sx={{ color: '#94a3b8' }}>
          {confirmedBooking ? 'Close' : 'Cancel'}
        </Button>

        {!confirmedBooking && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <CheckCircle2 className="w-4 h-4 text-slate-950" />}
            sx={{
              bgcolor: '#10b981',
              color: '#022c22',
              fontWeight: 800,
              '&:hover': { bgcolor: '#059669' }
            }}
          >
            {loading ? 'Submitting...' : 'Confirm Schedule'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
