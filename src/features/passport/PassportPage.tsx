import React, { useState, useEffect } from 'react';
import { getLocalPassport, saveLocalPassport } from '../../services/storage';
import { updatePassportPoints } from '../../services/api';
import type { UserPassportProfile, CulturalBadge } from '../../types/passport';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Award, CheckCircle, HelpCircle, Sparkles, User, Database, Shield } from 'lucide-react';

export const PassportPage: React.FC = () => {
  const [profile, setProfile] = useState<UserPassportProfile | null>(null);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizSuccess, setQuizSuccess] = useState(false);

  useEffect(() => {
    const loaded = getLocalPassport();
    setProfile(loaded);
  }, []);

  // Preset Badges Showcase
  const allBadges: CulturalBadge[] = [
    {
      id: 'badge-starter',
      name: 'Hạt Mầm Di Sản',
      description: 'Bắt đầu hành trình tìm về cội nguồn văn hóa Việt.',
      icon: '🌱',
      category: 'explorer',
      requirementText: 'Gia nhập Hồn Làng',
      unlockedAt: profile?.joinedAt,
    },
    {
      id: 'badge-craft-master',
      name: 'Đại Sứ Làng Nghề',
      description: 'Khám phá và tìm hiểu kỹ nghệ nón lá & se hương trầm.',
      icon: '🎨',
      category: 'craftsman',
      requirementText: 'Khám phá 2 làng nghề truyền thống',
      unlockedAt: '2026-11-13T10:00:00.000Z',
    },
    {
      id: 'badge-imperial-scholar',
      name: 'Học Giả Cố Đô',
      description: 'Trả lời đúng các câu hỏi di sản văn hóa triều Nguyễn.',
      icon: '📜',
      category: 'scholar',
      requirementText: 'Đạt 200 điểm thử thách văn hóa',
    },
    {
      id: 'badge-hue-connoisseur',
      name: 'Tinh Hoa Cố Đô',
      description: 'Hoàn thành chuyến hành trình văn hóa tự tạo bằng AI.',
      icon: '👑',
      category: 'explorer',
      requirementText: 'Lưu 1 hành trình Gemini AI',
    },
  ];

  // Interactive Heritage Quiz for Demo
  const currentQuiz = {
    id: 'quiz-tay-ho-1',
    question: 'Chiếc nón bài thơ trứ danh của Làng nón Tây Hồ có điểm gì đặc sắc nhất khi soi dưới ánh nắng mặt trời?',
    options: [
      'Có phủ một lớp vàng mỏng theo phong cách cung đình',
      'Hiện rõ câu thơ đối và hình ảnh danh thắng xứ Huế ẩn giữa hai lớp lá',
      'Phát ra âm thanh tiếng đàn du dương theo ngọn gió',
      'Đổi sang màu đỏ thắm theo nhiệt độ buổi trưa',
    ],
    correctIndex: 1,
    explanation: 'Nón bài thơ ra đời khoảng năm 1959-1960. Nghệ nhân đã khéo léo chèn các câu thơ ca ngợi vẻ đẹp xứ Huế và hình ảnh chùa Thiên Mụ vào giữa hai lớp lá nón, khi soi dưới nắng mới nhìn thấy.',
    pointsAward: 50,
  };

  const handleAnswerSubmit = () => {
    if (selectedQuizAnswer === null || !profile) return;
    setQuizSubmitted(true);
    const isCorrect = selectedQuizAnswer === currentQuiz.correctIndex;
    setQuizSuccess(isCorrect);

    if (isCorrect && !profile.completedQuizIds.includes(currentQuiz.id)) {
      const updatedProfile: UserPassportProfile = {
        ...profile,
        points: profile.points + currentQuiz.pointsAward,
        completedQuizIds: [...profile.completedQuizIds, currentQuiz.id],
      };
      setProfile(updatedProfile);
      saveLocalPassport(updatedProfile);
      updatePassportPoints(profile.userId, currentQuiz.pointsAward, currentQuiz.id);
    }
  };

  if (!profile) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Profile Header Card */}
      <Card className="p-6 sm:p-8 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-ivory-100 border-none shadow-card">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
            {/* Avatar Placeholder */}
            <div className="w-20 h-20 rounded-2xl bg-primary-800 border-2 border-ochre-400/60 flex items-center justify-center text-ochre-300 shadow-md">
              <User className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ivory-100">
                  {profile.displayName}
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-ochre-500 text-white">
                  Cấp độ 2
                </span>
              </div>
              <p className="text-xs text-ivory-300">
                Thành viên Hồn Làng • ID: {profile.userId}
              </p>
              <div className="pt-2 flex items-center justify-center sm:justify-start space-x-3 text-xs text-primary-300">
                <span className="flex items-center space-x-1">
                  <Database className="w-3.5 h-3.5 text-ochre-400" />
                  <span>Cơ sở dữ liệu: MongoDB Atlas</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Xác thực Demo</span>
                </span>
              </div>
            </div>
          </div>

          {/* Points Metric Badge */}
          <div className="p-4 rounded-2xl bg-primary-900/80 border border-primary-800 text-center min-w-[140px]">
            <p className="text-xs uppercase tracking-wider text-primary-300 font-semibold">
              Điểm Di Sản
            </p>
            <p className="text-3xl font-extrabold text-ochre-400 mt-1">
              {profile.points}
            </p>
            <p className="text-[10px] text-ivory-400 mt-0.5">+50 điểm mỗi quiz</p>
          </div>
        </div>

        {/* Progress Bar towards Next Title */}
        <div className="mt-8 pt-6 border-t border-primary-800/70 space-y-2">
          <div className="flex justify-between text-xs text-ivory-300">
            <span>Tiến độ trở thành: <strong>Học Giả Cố Đô</strong></span>
            <span>{profile.points} / 300 Điểm</span>
          </div>
          <div className="w-full bg-primary-950 rounded-full h-2.5 overflow-hidden border border-primary-800">
            <div
              className="bg-gradient-to-r from-ochre-400 to-terracotta-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (profile.points / 300) * 100)}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Badges Collection Grid */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-terracotta-600" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary-950">
            Bộ Sưu Tập Huy Hiệu Văn Hóa
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {allBadges.map((badge) => {
            const isUnlocked = Boolean(badge.unlockedAt);
            return (
              <Card
                key={badge.id}
                className={`p-5 text-center space-y-3 transition border ${
                  isUnlocked
                    ? 'bg-white border-amber-200/80 shadow-soft'
                    : 'bg-stone-50/70 border-stone-200 opacity-60'
                }`}
              >
                <div
                  className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-2xl shadow-sm ${
                    isUnlocked
                      ? 'bg-amber-100 ring-4 ring-amber-50'
                      : 'bg-stone-200 text-stone-400'
                  }`}
                >
                  {badge.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-sm text-stone-900">
                    {badge.name}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-stone-100">
                  {isUnlocked ? (
                    <span className="text-[11px] font-semibold text-emerald-700 inline-flex items-center space-x-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Đã mở khóa</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-stone-400">
                      Yêu cầu: {badge.requirementText}
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Interactive Cultural Quiz Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-primary-800" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary-950">
            Thử Thách Tri Thức Cố Đô (Mini Quiz)
          </h2>
        </div>

        <Card className="p-6 sm:p-8 bg-white border border-stone-200/90 shadow-soft space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-terracotta-600">
              Câu hỏi số 1 • Chủ đề: Làng nghề thủ công
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-primary-950">
              {currentQuiz.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuiz.options.map((option, idx) => {
              const isSelected = selectedQuizAnswer === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={quizSubmitted}
                  onClick={() => setSelectedQuizAnswer(idx)}
                  className={`w-full text-left p-4 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                    isSelected
                      ? 'bg-primary-900 text-ivory-100 border-primary-900 shadow-sm'
                      : 'bg-white text-stone-800 border-stone-200 hover:bg-ivory-200'
                  }`}
                >
                  <span className="font-bold mr-2 text-ochre-400">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          {/* Quiz Action / Feedback */}
          {!quizSubmitted ? (
            <Button
              onClick={handleAnswerSubmit}
              disabled={selectedQuizAnswer === null}
              variant="accent"
              className="w-full sm:w-auto"
            >
              Kiểm Tra Câu Trả Lời (+50 Điểm)
            </Button>
          ) : (
            <div
              className={`p-4 rounded-2xl border space-y-2 ${
                quizSuccess
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center space-x-2 font-bold text-sm">
                {quizSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span>Chính xác tuyệt đối! Bạn được cộng +50 điểm di sản.</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    <span>Chưa hoàn toàn chính xác. Hãy cùng xem lời giải thích nhé:</span>
                  </>
                )}
              </div>
              <p className="text-xs sm:text-sm leading-relaxed">{currentQuiz.explanation}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
