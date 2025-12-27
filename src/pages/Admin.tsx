import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';

const ADMIN_PASSWORD = 'admin2024';

interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  messages: {
    id: string;
    text: string;
    sender: 'user' | 'admin';
    time: string;
  }[];
  status: 'open' | 'closed';
  createdAt: string;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  
  const [tickets] = useState<SupportTicket[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Анна Петрова',
      userAvatar: '👧',
      messages: [
        {
          id: '1',
          text: 'Здравствуйте! Не могу добавить друга в список',
          sender: 'user',
          time: '14:23',
        },
      ],
      status: 'open',
      createdAt: '2024-12-27',
    },
    {
      id: '2',
      userId: '2',
      userName: 'Иван Сидоров',
      userAvatar: '👨',
      messages: [
        {
          id: '1',
          text: 'Как изменить аватарку?',
          sender: 'user',
          time: '15:10',
        },
        {
          id: '2',
          text: 'Перейдите в раздел "Профиль" и нажмите "Редактировать профиль"',
          sender: 'admin',
          time: '15:12',
        },
        {
          id: '3',
          text: 'Спасибо, разобрался!',
          sender: 'user',
          time: '15:15',
        },
      ],
      status: 'closed',
      createdAt: '2024-12-27',
    },
  ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success('Добро пожаловать в админ-панель!');
    } else {
      toast.error('Неверный пароль');
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    
    toast.success('Ответ отправлен!');
    setReplyText('');
  };

  const handleCloseTicket = () => {
    if (!selectedTicket) return;
    toast.success('Обращение закрыто');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 to-accent/10">
        <Card className="w-full max-w-md rounded-3xl border-2 border-primary/20 shadow-xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4">
                <Icon name="Shield" size={40} className="text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Админ-панель</h1>
              <p className="text-muted-foreground">Алиса AI - Поддержка пользователей</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-2xl h-12 text-center text-lg"
                  autoFocus
                />
              </div>
              
              <Button type="submit" className="w-full rounded-2xl h-12 text-lg font-medium">
                <Icon name="LogIn" size={20} className="mr-2" />
                Войти
              </Button>
            </form>
            
            <div className="mt-6 p-4 rounded-2xl bg-muted/50 text-sm text-center">
              <Icon name="Info" size={16} className="inline mr-1" />
              Доступ только для администратора
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Поддержка пользователей</h1>
            <p className="text-muted-foreground">Управление обращениями</p>
          </div>
          <Button
            variant="outline"
            className="rounded-2xl"
            onClick={() => setIsAuthenticated(false)}
          >
            <Icon name="LogOut" size={20} className="mr-2" />
            Выйти
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 rounded-3xl border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Inbox" size={20} />
                Обращения
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {tickets.map((ticket) => (
                    <button
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`w-full text-left p-4 rounded-2xl transition-all ${
                        selectedTicket?.id === ticket.id
                          ? 'bg-primary/20 border-2 border-primary'
                          : 'bg-muted/50 hover:bg-muted border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="text-2xl">{ticket.userAvatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold truncate">{ticket.userName}</h3>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                ticket.status === 'open'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {ticket.status === 'open' ? 'Открыто' : 'Закрыто'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {ticket.messages[ticket.messages.length - 1].text}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {ticket.messages.length} сообщений
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 rounded-3xl border-2 border-primary/20">
            {selectedTicket ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="text-2xl">{selectedTicket.userAvatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{selectedTicket.userName}</CardTitle>
                        <p className="text-sm text-muted-foreground">ID: {selectedTicket.userId}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-2xl"
                      onClick={handleCloseTicket}
                      disabled={selectedTicket.status === 'closed'}
                    >
                      {selectedTicket.status === 'open' ? (
                        <>
                          <Icon name="CheckCircle" size={16} className="mr-2" />
                          Закрыть обращение
                        </>
                      ) : (
                        <>
                          <Icon name="Check" size={16} className="mr-2" />
                          Закрыто
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <ScrollArea className="h-[450px] mb-4">
                    <div className="space-y-4">
                      {selectedTicket.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-md px-4 py-3 rounded-2xl ${
                              message.sender === 'admin'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-secondary-foreground'
                            }`}
                          >
                            <p className="mb-1">{message.text}</p>
                            <p className="text-xs opacity-70">{message.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <Separator className="my-4" />

                  <div className="flex gap-2">
                    <Input
                      placeholder="Напишите ответ..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                      className="rounded-2xl"
                      disabled={selectedTicket.status === 'closed'}
                    />
                    <Button
                      onClick={handleSendReply}
                      className="rounded-2xl"
                      disabled={selectedTicket.status === 'closed'}
                    >
                      <Icon name="Send" size={20} />
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-[600px]">
                <div className="text-center">
                  <Icon name="MessageSquare" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Выберите обращение</h3>
                  <p className="text-muted-foreground">Нажмите на обращение слева, чтобы начать общение</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        <Card className="mt-6 rounded-3xl border-2 border-primary/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-2xl bg-green-50">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {tickets.filter(t => t.status === 'open').length}
                </div>
                <p className="text-sm text-muted-foreground">Открытых обращений</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-blue-50">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {tickets.filter(t => t.status === 'closed').length}
                </div>
                <p className="text-sm text-muted-foreground">Закрытых обращений</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-purple-50">
                <div className="text-3xl font-bold text-purple-600 mb-1">{tickets.length}</div>
                <p className="text-sm text-muted-foreground">Всего обращений</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
