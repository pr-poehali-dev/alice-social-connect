import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';

interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'friend';
  time: string;
}

interface SupportMessage {
  id: string;
  text: string;
  sender: 'user' | 'admin';
  time: string;
}

const BACKGROUND_COLORS = [
  { name: 'Лаванда', color: 'hsl(270, 50%, 98%)' },
  { name: 'Персик', color: 'hsl(20, 100%, 95%)' },
  { name: 'Мята', color: 'hsl(150, 60%, 95%)' },
  { name: 'Небо', color: 'hsl(200, 80%, 95%)' },
  { name: 'Роза', color: 'hsl(340, 70%, 95%)' },
];

export default function Index() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
  const [showSupportDialog, setShowSupportDialog] = useState(false);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [supportText, setSupportText] = useState('');
  
  const [friends, setFriends] = useState<Friend[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUser: User = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      avatar: formData.get('avatar') as string || '😊',
    };
    setUser(newUser);
    setUsers([...users, newUser]);
    setIsRegistered(true);
    setShowWelcomeBanner(true);
    
    setTimeout(() => {
      setShowWelcomeBanner(false);
    }, 5000);
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedFriend) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'me',
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  const handleCall = () => {
    toast.info('Переход в приложение Телефон...');
    setTimeout(() => {
      window.open('tel:+79999999999', '_self');
    }, 500);
  };

  const changeBackground = (color: string) => {
    document.documentElement.style.setProperty('--background', color);
    toast.success('Фон изменён!');
  };

  const filteredUsers = users.filter(u => 
    u.id !== user?.id && u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddFriend = (friendUser: User) => {
    const newFriend: Friend = {
      id: friendUser.id,
      name: friendUser.name,
      avatar: friendUser.avatar,
      status: 'online',
    };
    setFriends([...friends, newFriend]);
    toast.success(`${friendUser.name} добавлен в друзья!`);
  };
  
  const handleSendSupport = () => {
    if (!supportText.trim()) return;
    
    const newMessage: SupportMessage = {
      id: Date.now().toString(),
      text: supportText,
      sender: 'user',
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };
    
    setSupportMessages([...supportMessages, newMessage]);
    setSupportText('');
    toast.success('Сообщение отправлено в поддержку!');
  };

  if (!isRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg rounded-3xl border-2 border-primary/20">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-primary mb-2">Алиса AI</h1>
              <p className="text-muted-foreground">Социальная сеть нового поколения</p>
            </div>
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ваше имя"
                  required
                  className="rounded-2xl"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Номер телефона</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+7 (999) 999-99-99"
                  required
                  className="rounded-2xl"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Почта</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@mail.ru"
                  required
                  className="rounded-2xl"
                />
              </div>
              
              <div>
                <Label htmlFor="avatar">Аватарка (эмодзи)</Label>
                <Input
                  id="avatar"
                  name="avatar"
                  placeholder="😊"
                  maxLength={2}
                  className="rounded-2xl text-2xl"
                />
              </div>
              
              <Button type="submit" className="w-full rounded-2xl h-12 text-lg font-medium">
                Зарегистрироваться
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      {showWelcomeBanner && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <Card className="rounded-3xl border-2 border-primary shadow-xl bg-primary/10 backdrop-blur">
            <CardContent className="p-4 px-6 flex items-center gap-3">
              <Icon name="CheckCircle" size={24} className="text-primary" />
              <p className="font-medium text-lg">Вы успешно зарегистрированы в Алиса AI!</p>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full ml-2"
                onClick={() => setShowWelcomeBanner(false)}
              >
                <Icon name="X" size={16} />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 rounded-3xl p-2 h-auto">
            <TabsTrigger value="profile" className="rounded-2xl py-3 flex flex-col items-center gap-1">
              <Icon name="User" size={20} />
              <span className="text-xs">Профиль</span>
            </TabsTrigger>
            <TabsTrigger value="friends" className="rounded-2xl py-3 flex flex-col items-center gap-1">
              <Icon name="Users" size={20} />
              <span className="text-xs">Друзья</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="rounded-2xl py-3 flex flex-col items-center gap-1">
              <Icon name="Search" size={20} />
              <span className="text-xs">Поиск</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-2xl py-3 flex flex-col items-center gap-1">
              <Icon name="Settings" size={20} />
              <span className="text-xs">Параметры</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="rounded-3xl border-2 border-primary/20 shadow-lg">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-32 w-32 border-4 border-primary/30">
                    <AvatarFallback className="text-6xl">{user?.avatar}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{user?.name}</h2>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <p className="text-muted-foreground">{user?.phone}</p>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="rounded-2xl w-full max-w-xs">
                        <Icon name="Edit" size={16} className="mr-2" />
                        Редактировать профиль
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl">
                      <DialogHeader>
                        <DialogTitle>Редактирование профиля</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div>
                          <Label>Имя</Label>
                          <Input defaultValue={user?.name} className="rounded-2xl" />
                        </div>
                        <div>
                          <Label>Почта</Label>
                          <Input defaultValue={user?.email} className="rounded-2xl" />
                        </div>
                        <div>
                          <Label>Аватарка</Label>
                          <Input defaultValue={user?.avatar} className="rounded-2xl text-2xl" maxLength={2} />
                        </div>
                        <Button className="w-full rounded-2xl">Сохранить</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="friends" className="space-y-6">
            {friends.length === 0 ? (
              <Card className="rounded-3xl border-2 border-primary/20">
                <CardContent className="p-12 text-center">
                  <Icon name="Users" size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">У вас пока нет друзей</h3>
                  <p className="text-muted-foreground">Найдите пользователей в разделе «Поиск» и добавьте их в друзья</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {friends.map((friend) => (
                <Card
                  key={friend.id}
                  className="rounded-3xl border-2 border-primary/20 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedFriend(friend)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-primary/30">
                          <AvatarFallback className="text-3xl">{friend.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{friend.name}</h3>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                              }`}
                            />
                            <span className="text-sm text-muted-foreground">
                              {friend.status === 'online' ? 'В сети' : 'Не в сети'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-2xl"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFriend(friend);
                            setMessages([]);
                          }}
                        >
                          <Icon name="MessageCircle" size={20} />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-2xl"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCall();
                          }}
                        >
                          <Icon name="Phone" size={20} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}

            {selectedFriend && (
              <Card className="rounded-3xl border-2 border-primary/20 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="text-2xl">{selectedFriend.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{selectedFriend.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {selectedFriend.status === 'online' ? 'В сети' : 'Не в сети'}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="outline"
                      className="rounded-2xl"
                      onClick={handleCall}
                    >
                      <Icon name="Phone" size={20} />
                    </Button>
                  </div>

                  <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-2xl ${
                            msg.sender === 'me'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Написать сообщение..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="rounded-2xl"
                    />
                    <Button onClick={handleSendMessage} className="rounded-2xl">
                      <Icon name="Send" size={20} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <Card className="rounded-3xl border-2 border-primary/20 shadow-lg">
              <CardContent className="p-6">
                <div className="relative mb-6">
                  <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Поиск друзей..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-2xl"
                  />
                </div>

                <div className="space-y-3">
                  {filteredUsers.map((foundUser) => {
                    const isAlreadyFriend = friends.some(f => f.id === foundUser.id);
                    return (
                      <div
                        key={foundUser.id}
                        className="flex items-center justify-between p-4 rounded-2xl hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="text-2xl">{foundUser.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{foundUser.name}</h3>
                            <p className="text-xs text-muted-foreground">{foundUser.email}</p>
                          </div>
                        </div>
                        {isAlreadyFriend ? (
                          <Button size="sm" variant="outline" className="rounded-2xl" disabled>
                            <Icon name="Check" size={16} className="mr-2" />
                            Уже в друзьях
                          </Button>
                        ) : (
                          <Button size="sm" className="rounded-2xl" onClick={() => handleAddFriend(foundUser)}>
                            <Icon name="UserPlus" size={16} className="mr-2" />
                            Добавить
                          </Button>
                        )}
                      </div>
                    );
                  })}
                  
                  {filteredUsers.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      {users.length === 1 ? 'Пока нет других пользователей. Пригласите друзей!' : 'Ничего не найдено'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="rounded-3xl border-2 border-primary/20 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">Настройки фона</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {BACKGROUND_COLORS.map((bg) => (
                    <button
                      key={bg.name}
                      onClick={() => changeBackground(bg.color)}
                      className="p-6 rounded-2xl border-2 hover:border-primary transition-all text-center"
                      style={{ backgroundColor: bg.color }}
                    >
                      <p className="font-medium">{bg.name}</p>
                    </button>
                  ))}
                </div>

                <div className="mt-8 space-y-4">
                  <Button variant="outline" className="w-full rounded-2xl justify-start" size="lg">
                    <Icon name="Bell" size={20} className="mr-3" />
                    Уведомления
                  </Button>
                  <Button variant="outline" className="w-full rounded-2xl justify-start" size="lg">
                    <Icon name="Lock" size={20} className="mr-3" />
                    Приватность
                  </Button>
                  <Dialog open={showSupportDialog} onOpenChange={setShowSupportDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full rounded-2xl justify-start" size="lg">
                        <Icon name="HelpCircle" size={20} className="mr-3" />
                        Помощь
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Icon name="MessageCircleQuestion" size={24} />
                          Служба поддержки
                        </DialogTitle>
                        <DialogDescription>
                          Опишите вашу проблему, и администратор ответит вам в ближайшее время
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="h-96 overflow-y-auto space-y-3 p-4 bg-muted/30 rounded-2xl">
                          {supportMessages.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-center">
                              <div>
                                <Icon name="MessageSquare" size={48} className="mx-auto mb-3 text-muted-foreground opacity-50" />
                                <p className="text-muted-foreground">Начните диалог с поддержкой</p>
                              </div>
                            </div>
                          ) : (
                            supportMessages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-md px-4 py-3 rounded-2xl ${
                                    msg.sender === 'user'
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-secondary text-secondary-foreground'
                                  }`}
                                >
                                  {msg.sender === 'admin' && (
                                    <div className="flex items-center gap-2 mb-1">
                                      <Icon name="Shield" size={14} />
                                      <span className="text-xs font-semibold">Администратор</span>
                                    </div>
                                  )}
                                  <p className="mb-1">{msg.text}</p>
                                  <p className="text-xs opacity-70">{msg.time}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Input
                            placeholder="Напишите ваш вопрос..."
                            value={supportText}
                            onChange={(e) => setSupportText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendSupport()}
                            className="rounded-2xl"
                          />
                          <Button onClick={handleSendSupport} className="rounded-2xl">
                            <Icon name="Send" size={20} />
                          </Button>
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-2xl text-sm">
                          <div className="flex items-start gap-2">
                            <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-blue-900 mb-1">Как мы можем помочь?</p>
                              <ul className="text-blue-700 space-y-1 text-xs">
                                <li>• Проблемы с регистрацией или входом</li>
                                <li>• Вопросы по добавлению друзей</li>
                                <li>• Технические неполадки</li>
                                <li>• Предложения по улучшению</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}